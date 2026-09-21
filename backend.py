"""
Online Reservation System - Airline & Railway
Flask Backend (Single File)
"""

import os
import uuid
import bcrypt
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity
)
from pymongo import MongoClient
from bson import ObjectId
from bson.json_util import dumps
import json

# ─────────────────────────────────────────────────────────────
# App Configuration
# ─────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["JWT_SECRET_KEY"] = "airline-railway-super-secret-key-2024"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

jwt = JWTManager(app)

# ─────────────────────────────────────────────────────────────
# MongoDB Connection
# ─────────────────────────────────────────────────────────────
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    client.server_info()  # Test connection
    db = client["reservation_system"]
    print("MongoDB connected successfully.")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    print("   Make sure MongoDB is running on localhost:27017")
    db = None

# Collections
def get_col(name):
    if db is None:
        raise RuntimeError("Database not connected")
    return db[name]

# ─────────────────────────────────────────────────────────────
# Helper: ObjectId serializer
# ─────────────────────────────────────────────────────────────
def serialize(doc):
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize(d) for d in doc]
    doc = dict(doc)
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
        elif isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


# ─────────────────────────────────────────────────────────────
# Seed Data
# ─────────────────────────────────────────────────────────────
CITIES = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore",
          "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"]

AIRLINES = [
    {"code": "AI", "name": "Air India"},
    {"code": "6E", "name": "IndiGo"},
    {"code": "SG", "name": "SpiceJet"},
    {"code": "UK", "name": "Vistara"},
    {"code": "G8", "name": "GoAir"},
]

TRAINS = [
    {"number": "12301", "name": "Rajdhani Express"},
    {"number": "12259", "name": "Duronto Express"},
    {"number": "22691", "name": "Shatabdi Express"},
    {"number": "12431", "name": "Thiruvananthapuram Rajdhani"},
    {"number": "12002", "name": "Bhopal Shatabdi"},
    {"number": "19019", "name": "Mumbai Express"},
    {"number": "22222", "name": "CST Mumbai Rajdhani"},
]


def seed_flights():
    flights_col = get_col("flights")
    if flights_col.count_documents({}) > 0:
        return
    flights = []
    import random
    random.seed(42)
    for i in range(50):
        src = random.choice(CITIES)
        dst = random.choice([c for c in CITIES if c != src])
        airline = random.choice(AIRLINES)
        dep_hour = random.randint(5, 22)
        dep_min = random.choice([0, 15, 30, 45])
        dur_h = random.randint(1, 4)
        dur_m = random.choice([0, 30])
        arr_hour = (dep_hour + dur_h) % 24
        arr_min = (dep_min + dur_m) % 60
        flight_num = f"{airline['code']}{random.randint(100, 999)}"
        flights.append({
            "flight_number": flight_num,
            "airline": airline["name"],
            "airline_code": airline["code"],
            "source": src,
            "destination": dst,
            "departure_time": f"{dep_hour:02d}:{dep_min:02d}",
            "arrival_time": f"{arr_hour:02d}:{arr_min:02d}",
            "duration": f"{dur_h}h {dur_m}m",
            "economy_price": random.randint(2500, 8000),
            "business_price": random.randint(9000, 25000),
            "economy_seats": random.randint(20, 100),
            "business_seats": random.randint(5, 30),
            "created_at": datetime.utcnow(),
        })
    flights_col.insert_many(flights)
    print(f"✅ Seeded {len(flights)} flights.")


def seed_trains():
    trains_col = get_col("trains")
    if trains_col.count_documents({}) > 0:
        return
    trains = []
    import random
    random.seed(99)
    for i in range(40):
        src = random.choice(CITIES)
        dst = random.choice([c for c in CITIES if c != src])
        train = random.choice(TRAINS)
        dep_hour = random.randint(4, 23)
        dep_min = random.choice([0, 15, 30, 45])
        dur_h = random.randint(4, 24)
        trains.append({
            "train_number": train["number"],
            "train_name": train["name"],
            "source": src,
            "destination": dst,
            "departure_time": f"{dep_hour:02d}:{dep_min:02d}",
            "duration": f"{dur_h}h",
            "general_price": random.randint(150, 500),
            "sleeper_price": random.randint(500, 1200),
            "ac_price": random.randint(1200, 3500),
            "general_seats": random.randint(50, 200),
            "sleeper_seats": random.randint(20, 80),
            "ac_seats": random.randint(10, 40),
            "days_of_week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "created_at": datetime.utcnow(),
        })
    trains_col.insert_many(trains)
    print(f"✅ Seeded {len(trains)} trains.")


# ─────────────────────────────────────────────────────────────
# AUTH ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    users = get_col("users")
    if users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user_id = str(users.insert_one({
        "name": name,
        "email": email,
        "password": hashed,
        "created_at": datetime.utcnow(),
    }).inserted_id)

    token = create_access_token(identity=user_id, additional_claims={"name": name, "email": email})
    return jsonify({"token": token, "user": {"id": user_id, "name": name, "email": email}}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    users = get_col("users")
    user = users.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"error": "Invalid Credentials"}), 401

    user_id = str(user["_id"])
    token = create_access_token(
        identity=user_id,
        additional_claims={"name": user["name"], "email": user["email"]}
    )
    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"], 
            "email": user["email"]
        }
    }), 200


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    users = get_col("users")
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user_id, "name": user["name"], "email": user["email"]}), 200


# ─────────────────────────────────────────────────────────────
# FLIGHT ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/api/flights/search", methods=["GET"])
@jwt_required()
def search_flights():
    source = request.args.get("source", "").strip()
    destination = request.args.get("destination", "").strip()
    date = request.args.get("date", "")
    passengers = int(request.args.get("passengers", 1))
    travel_class = request.args.get("class", "economy").lower()

    if not source or not destination:
        return jsonify({"error": "Source and destination required"}), 400

    query = {
        "source": {"$regex": f"^{source}$", "$options": "i"},
        "destination": {"$regex": f"^{destination}$", "$options": "i"},
    }

    seat_field = "business_seats" if travel_class == "business" else "economy_seats"
    query[seat_field] = {"$gte": passengers}

    flights = list(get_col("flights").find(query))
    return jsonify({"flights": serialize(flights), "date": date, "passengers": passengers}), 200


@app.route("/api/flights/book", methods=["POST"])
@jwt_required()
def book_flight():
    user_id = get_jwt_identity()
    data = request.get_json()

    flight_id = data.get("flight_id")
    passengers = data.get("passengers", [])
    travel_class = data.get("class", "economy").lower()
    travel_date = data.get("date")
    payment_id = data.get("payment_id")

    if not flight_id or not passengers or not travel_date:
        return jsonify({"error": "flight_id, passengers, and date are required"}), 400

    flights_col = get_col("flights")
    flight = flights_col.find_one({"_id": ObjectId(flight_id)})
    if not flight:
        return jsonify({"error": "Flight not found"}), 404

    seat_field = "business_seats" if travel_class == "business" else "economy_seats"
    price_field = "business_price" if travel_class == "business" else "economy_price"
    count = len(passengers)

    if flight[seat_field] < count:
        return jsonify({"error": "Not enough seats available"}), 400

    total_amount = flight[price_field] * count
    pnr = f"AI{uuid.uuid4().hex[:8].upper()}"

    booking = {
        "pnr": pnr,
        "type": "flight",
        "user_id": user_id,
        "flight_id": flight_id,
        "flight_number": flight["flight_number"],
        "airline": flight["airline"],
        "source": flight["source"],
        "destination": flight["destination"],
        "departure_time": flight["departure_time"],
        "arrival_time": flight["arrival_time"],
        "travel_date": travel_date,
        "travel_class": travel_class,
        "passengers": passengers,
        "total_amount": total_amount,
        "payment_id": payment_id,
        "status": "confirmed",
        "booked_at": datetime.utcnow(),
    }

    booking_id = str(get_col("bookings").insert_one(booking).inserted_id)
    flights_col.update_one({"_id": ObjectId(flight_id)}, {"$inc": {seat_field: -count}})

    booking["_id"] = booking_id
    return jsonify({"booking": serialize(booking), "pnr": pnr}), 201


# ─────────────────────────────────────────────────────────────
# TRAIN ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/api/trains/search", methods=["GET"])
@jwt_required()
def search_trains():
    source = request.args.get("source", "").strip()
    destination = request.args.get("destination", "").strip()
    date = request.args.get("date", "")
    passengers = int(request.args.get("passengers", 1))
    coach = request.args.get("coach", "sleeper").lower()

    if not source or not destination:
        return jsonify({"error": "Source and destination required"}), 400

    coach_map = {"general": "general_seats", "sleeper": "sleeper_seats", "ac": "ac_seats"}
    seat_field = coach_map.get(coach, "sleeper_seats")

    query = {
        "source": {"$regex": f"^{source}$", "$options": "i"},
        "destination": {"$regex": f"^{destination}$", "$options": "i"},
        seat_field: {"$gte": passengers},
    }

    trains = list(get_col("trains").find(query))
    return jsonify({"trains": serialize(trains), "date": date, "passengers": passengers}), 200


@app.route("/api/trains/book", methods=["POST"])
@jwt_required()
def book_train():
    user_id = get_jwt_identity()
    data = request.get_json()

    train_id = data.get("train_id")
    passengers = data.get("passengers", [])
    coach = data.get("coach", "sleeper").lower()
    travel_date = data.get("date")
    payment_id = data.get("payment_id")

    if not train_id or not passengers or not travel_date:
        return jsonify({"error": "train_id, passengers, and date are required"}), 400

    trains_col = get_col("trains")
    train = trains_col.find_one({"_id": ObjectId(train_id)})
    if not train:
        return jsonify({"error": "Train not found"}), 404

    coach_map = {
        "general": ("general_seats", "general_price"),
        "sleeper": ("sleeper_seats", "sleeper_price"),
        "ac": ("ac_seats", "ac_price"),
    }
    seat_field, price_field = coach_map.get(coach, ("sleeper_seats", "sleeper_price"))
    count = len(passengers)

    if train[seat_field] < count:
        return jsonify({"error": "Not enough seats available"}), 400

    total_amount = train[price_field] * count
    pnr = f"TR{uuid.uuid4().hex[:8].upper()}"

    booking = {
        "pnr": pnr,
        "type": "train",
        "user_id": user_id,
        "train_id": train_id,
        "train_number": train["train_number"],
        "train_name": train["train_name"],
        "source": train["source"],
        "destination": train["destination"],
        "departure_time": train["departure_time"],
        "travel_date": travel_date,
        "coach_type": coach,
        "passengers": passengers,
        "total_amount": total_amount,
        "payment_id": payment_id,
        "status": "confirmed",
        "booked_at": datetime.utcnow(),
    }

    booking_id = str(get_col("bookings").insert_one(booking).inserted_id)
    trains_col.update_one({"_id": ObjectId(train_id)}, {"$inc": {seat_field: -count}})

    booking["_id"] = booking_id
    return jsonify({"booking": serialize(booking), "pnr": pnr}), 201


# ─────────────────────────────────────────────────────────────
# PAYMENT ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/api/payment/process", methods=["POST"])
@jwt_required()
def process_payment():
    user_id = get_jwt_identity()
    data = request.get_json()

    amount = data.get("amount")
    method = data.get("method")  # credit_card | debit_card | upi
    payload = data.get("payload", {})

    if not amount or not method:
        return jsonify({"error": "Amount and method are required"}), 400

    # Simulate payment processing
    payment_id = f"PAY{uuid.uuid4().hex[:12].upper()}"
    payment = {
        "payment_id": payment_id,
        "user_id": user_id,
        "amount": amount,
        "method": method,
        "status": "success",
        "processed_at": datetime.utcnow(),
    }
    get_col("payments").insert_one(payment)

    return jsonify({
        "payment_id": payment_id,
        "status": "success",
        "amount": amount,
        "method": method,
        "message": "Payment processed successfully",
    }), 200


@app.route("/api/payment/<payment_id>", methods=["GET"])
@jwt_required()
def get_payment(payment_id):
    payment = get_col("payments").find_one({"payment_id": payment_id})
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify(serialize(payment)), 200


# ─────────────────────────────────────────────────────────────
# BOOKING MANAGEMENT ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/api/bookings", methods=["GET"])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()
    bookings = list(get_col("bookings").find(
        {"user_id": user_id},
        sort=[("booked_at", -1)]
    ))
    return jsonify({"bookings": serialize(bookings)}), 200


@app.route("/api/bookings/<booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):
    user_id = get_jwt_identity()
    try:
        booking = get_col("bookings").find_one({
            "_id": ObjectId(booking_id),
            "user_id": user_id
        })
    except Exception:
        return jsonify({"error": "Invalid booking ID"}), 400

    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    return jsonify(serialize(booking)), 200


@app.route("/api/bookings/<booking_id>/cancel", methods=["POST"])
@jwt_required()
def cancel_booking(booking_id):
    user_id = get_jwt_identity()
    try:
        result = get_col("bookings").update_one(
            {"_id": ObjectId(booking_id), "user_id": user_id, "status": "confirmed"},
            {"$set": {"status": "cancelled", "cancelled_at": datetime.utcnow()}}
        )
    except Exception:
        return jsonify({"error": "Invalid booking ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Booking not found or already cancelled"}), 404
    return jsonify({"message": "Booking cancelled successfully"}), 200


@app.route("/api/bookings/<booking_id>/ticket", methods=["GET"])
@jwt_required()
def get_ticket(booking_id):
    user_id = get_jwt_identity()
    try:
        booking = get_col("bookings").find_one({
            "_id": ObjectId(booking_id),
            "user_id": user_id
        })
    except Exception:
        return jsonify({"error": "Invalid booking ID"}), 400

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Return ticket as JSON (frontend renders it)
    return jsonify(serialize(booking)), 200


# ─────────────────────────────────────────────────────────────
# UTILITY ROUTES
# ─────────────────────────────────────────────────────────────
@app.route("/api/cities", methods=["GET"])
def get_cities():
    return jsonify({"cities": CITIES}), 200


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "✈ SkyRail Reservation System API is running!",
        "version": "1.0"
    }), 200


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()}), 200


# ─────────────────────────────────────────────────────────────
# Main Entry Point
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if db is not None:
        try:
            seed_flights()
            seed_trains()
        except Exception as e:
            print(f"Seeding error: {e}")
    app.run(debug=True, port=5000, host="0.0.0.0")
