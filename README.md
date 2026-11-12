# ✈️🚆 Online Airline & Railway Reservation System
<div align="center">

A full-stack unified reservation platform for booking both airline and railway tickets through a single modern web interface.
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=700&lines=✈️+Airline+%26+Railway+Reservation;🚆+Full-Stack+Booking+Platform;Built+with+React+%2B+Flask+%2B+MongoDB" alt="Typing SVG" />

<br/>

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> **A modern, full-stack unified reservation platform for booking Airline & Railway tickets  
> with secure authentication, real-time seat availability, and multi-method payment processing.**

<br/>

[🚀 Getting Started](#-getting-started) •
[📖 Documentation](#-api-documentation) •
[✨ Features](#-features) •
[🛠️ Tech Stack](#-tech-stack) •
[📁 Structure](#-project-structure) •
[🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents
## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [UI Overview](#-ui-overview)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview
## 🌐 Overview

The **Online Airline & Railway Reservation System** is a unified platform that allows users to:
- Search and book **flight tickets** with seat/class selection
- Search and book **train tickets** with coach type selection
- Manage all bookings from a single dashboard
- Process payments via multiple methods
- View, download, and cancel bookings
```
┌─────────────────────────────────────────────────────────────────┐
│              AIRLINE & RAILWAY RESERVATION SYSTEM               │
│                                                                 │
│  ┌──────────┐    HTTP/REST    ┌──────────┐    PyMongo  ┌──────┐ │
│  │  React   │ ◄────────────► │  Flask   │ ◄─────────► │  DB  │ │
│  │ Frontend │   JWT + Axios  │ Backend  │             │Mongo │ │
│  │ :3000    │                │  :5000   │             │:27017│ │
│  └──────────┘                └──────────┘             └──────┘ │
└─────────────────────────────────────────────────────────────────┘
```

A **unified booking platform** that combines Airline and Railway reservations under one roof. Built with a **React SPA** frontend, a **Flask REST API** backend, and **MongoDB** as the data store — delivering a seamless end-to-end booking experience.

---

## ✨ Features

### 🔐 User Authentication
- Secure registration & login
- JWT-based session management
- Password hashing with bcrypt
- Persistent sessions via localStorage
<table>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- ✅ User Registration & Login
- ✅ **JWT** token-based session management
- ✅ Password hashing with **bcrypt**
- ✅ Protected API routes with decorators
- ✅ Persistent sessions via `localStorage`

### ✈️ Airline Reservation
- Search flights by source, destination & date
- View available flights with pricing
- Select seat class (Economy / Business)
- Multi-passenger booking with details
- ✅ Search flights by source, destination & date
- ✅ Real-time seat availability display
- ✅ Class selection — Economy / Business
- ✅ Multi-passenger booking with details
- ✅ Dynamic fare calculation

</td>
<td width="50%">

### 🚆 Railway Reservation
- Search trains by source, destination & date
- View train schedules and availability
- Select coach type (Sleeper / AC / General)
- Multi-passenger ticket booking
- ✅ Search trains by route & date
- ✅ Coach selection — Sleeper / AC / General
- ✅ Availability check per coach class
- ✅ Multi-passenger ticket booking
- ✅ Train schedule & timings view

### 💳 Payment Processing
- Credit Card, Debit Card & UPI support
- Secure payment form with validation
- Animated booking confirmation screen
- Auto-generated PNR numbers
### 💳 Payment & Bookings
- ✅ Credit Card / Debit Card / UPI support
- ✅ Auto-generated PNR numbers
- ✅ Booking confirmation with animation
- ✅ View, filter & cancel bookings
- ✅ In-app Ticket modal with **Print** support

### 📁 Booking Management
- View full booking history
- Filter by type (flights/trains) or status
- Cancel confirmed bookings
- View & print ticket modal
- PNR lookup
</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | React.js (SPA)          |
| Backend     | Python Flask (REST API) |
| Database    | MongoDB (NoSQL)         |
| Auth        | JWT (Flask-JWT-Extended)|
| HTTP Client | Axios                   |
| Styling     | Custom CSS (Dark Theme / Glassmorphism) |
| Notifications | React Toastify        |
| Icons       | Lucide React            |
```yaml
Frontend:
  - Framework     : React.js 18 (Single Page Application)
  - Routing       : React Router DOM v6
  - HTTP Client   : Axios
  - Notifications : React Toastify
  - Icons         : Lucide React
  - Styling       : Custom CSS  (Dark Theme + Glassmorphism)

Backend:
  - Framework     : Flask 3.x (Python)
  - Auth          : Flask-JWT-Extended
  - CORS          : Flask-Cors
  - DB Driver     : PyMongo
  - Encryption    : bcrypt
  - Config        : python-dotenv

Database:
  - Engine        : MongoDB 6.x (NoSQL)
  - Collections   : users, flights, trains, bookings, payments

DevTools:
  - Version Ctrl  : Git & GitHub
  - API Testing   : Postman / Thunder Client
  - Package Mgr   : npm (frontend), pip (backend)
```

---

## 📁 Project Structure

```
Airline And Railway Reservation System/
📦 Airline And Railway Reservation System
│
├── backend.py               # Flask REST API (single file)
├── requirements.txt         # Python dependencies
├── README.md
├── 📄 backend.py                    # Flask REST API — single file server
├── 📄 requirements.txt              # Python package dependencies
├── 📄 README.md                     # Project documentation
│
└── frontend/                # React SPA
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js           # Root component & routing
        ├── index.js         # React entry point
        ├── styles/
        │   └── App.css      # Global dark-theme design system
        └── components/
            ├── Login.js            # User login page
            ├── Register.js         # User registration page
            ├── Dashboard.js        # Home dashboard
            ├── AirlineReservation.js  # 4-step flight booking flow
            ├── RailwayReservation.js  # 4-step train booking flow
            ├── Payment.js          # Payment processing & confirmation
            └── BookingHistory.js   # Booking management & ticket viewer
└── 📂 frontend/                     # React SPA
    ├── 📄 package.json              # Node dependencies & proxy config
    │
    ├── 📂 public/
    │   └── 📄 index.html            # HTML entry point + meta + fonts
    │
    └── 📂 src/
        ├── 📄 App.js                # Root component, routing & AuthContext
        ├── 📄 index.js              # ReactDOM render entry
        │
        ├── 📂 styles/
        │   └── 📄 App.css           # Global design system (dark theme)
        │
        └── 📂 components/
            ├── 📄 Login.js              # Login form + JWT auth
            ├── 📄 Register.js           # Registration + validation
            ├── 📄 Dashboard.js          # Home dashboard + quick actions
            ├── 📄 AirlineReservation.js # 4-step flight booking wizard
            ├── 📄 RailwayReservation.js # 4-step train booking wizard
            ├── 📄 Payment.js            # Payment form + confirmation
            └── 📄 BookingHistory.js     # Booking list + ticket viewer
```

---

## ✅ Prerequisites
## 🚀 Getting Started

Make sure you have the following installed:
### Prerequisites

| Tool        | Version      | Download |
|-------------|--------------|----------|
| Python      | 3.8+         | [python.org](https://python.org) |
| Node.js     | 16+          | [nodejs.org](https://nodejs.org) |
| MongoDB     | 5.0+         | [mongodb.com](https://mongodb.com) |
| npm         | 8+           | Bundled with Node.js |
Ensure the following are installed on your system:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white&style=flat-square) Python | `3.8+` | [python.org](https://python.org) |
| ![Node](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) Node.js | `16+` | [nodejs.org](https://nodejs.org) |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square) MongoDB | `5.0+` | [mongodb.com](https://mongodb.com/try/download/community) |
| ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white&style=flat-square) npm | `8+` | Bundled with Node.js |

---

## ⚙️ Installation & Setup
### Installation

### 1. Clone the Repository
**1. Clone the repository**

```bash
git clone https://github.com/your-username/airline-railway-reservation.git
cd "Airline And Railway Reservation System"
```

### 2. Backend Setup
**2. Install Python backend dependencies**

```bash
# Install Python dependencies
pip install -r requirements.txt
```

**`requirements.txt` contents:**
```
Flask
Flask-Cors
Flask-JWT-Extended
pymongo
bcrypt
python-dotenv
```
> `requirements.txt`
> ```
> Flask
> Flask-Cors
> Flask-JWT-Extended
> pymongo
> bcrypt
> python-dotenv
> ```

### 3. Frontend Setup
**3. Install React frontend dependencies**

```bash
cd frontend
npm install
cd ..
```

### 4. MongoDB Setup
**4. Start MongoDB**

Ensure MongoDB is running locally on the default port:

```bash
# Windows (run as service or directly)
# Windows (run in a separate terminal)
mongod --dbpath C:\data\db

# macOS / Linux
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

> The backend will **automatically seed** sample flights and trains on first run.
> **Note:** The backend auto-seeds sample **flights** and **trains** data on the very first run. No manual data entry needed.

---

## 🚀 Running the Application
### Environment Variables

### Start the Backend (Flask)
Create a `.env` file in the **project root** (optional — defaults are used if not provided):

```env
# .env
MONGO_URI        = mongodb://localhost:27017/reservation_db
JWT_SECRET_KEY   = your_super_secret_jwt_key_change_this
JWT_EXPIRY_HOURS = 24
FLASK_DEBUG      = True
FLASK_PORT       = 5000
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

---

### Running the App

**Terminal 1 — Start Flask Backend**

```bash
# From project root
python backend.py
```

Flask server starts at → **http://localhost:5000**
```
 * Running on http://localhost:5000
 * MongoDB connected successfully
 * Sample flights seeded ✓
 * Sample trains seeded ✓
```

### Start the Frontend (React)
**Terminal 2 — Start React Frontend**

```bash
# From the frontend/ directory
# From frontend/ directory
cd frontend
npm start
```

React app starts at → **http://localhost:3000**
```
Compiled successfully!

> The React dev server is configured to proxy API requests to `http://localhost:5000` automatically.
  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

> The React dev server **proxies all `/api/*` calls** to `http://localhost:5000` automatically via `package.json` proxy config.

**Open in Browser**

```
http://localhost:3000
```

---

## 🔌 API Endpoints
## 📖 API Documentation

### Authentication
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| POST   | `/api/auth/register`   | Register new user   |
| POST   | `/api/auth/login`      | Login & get JWT     |
### Base URL
```
http://localhost:5000/api
```

### Flights
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/flights/search`     | Search available flights |
| POST   | `/api/flights/book`       | Book a flight            |
### 🔐 Authentication

### Trains
| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| GET    | `/api/trains/search`      | Search available trains |
| POST   | `/api/trains/book`        | Book a train ticket     |
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | `{ name, email, password }` | Register a new user |
| `POST` | `/auth/login` | `{ email, password }` | Login & receive JWT token |

### Payments
| Method | Endpoint               | Description             |
|--------|------------------------|-------------------------|
| POST   | `/api/payment/process` | Process a payment       |
```bash
# Example: Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

### Bookings
| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/api/bookings`                 | Get all user bookings   |
| GET    | `/api/bookings/:id/ticket`      | Get ticket details      |
| POST   | `/api/bookings/:id/cancel`      | Cancel a booking        |
# Example: Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

---
### ✈️ Flights

## 🎨 UI Highlights
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/flights/search?from=DEL&to=BOM&date=2026-11-15` | ✅ | Search flights |
| `POST` | `/flights/book` | ✅ | Book a flight |

- 🌑 **Dark Theme** with glassmorphism effects
- 📱 **Fully Responsive** layout
- 🎞️ Smooth animations and fade-in transitions
- 🧭 **Multi-step booking wizard** for both flights and trains
- 🎫 **In-app Ticket Modal** with print support
- 🔔 Toast notifications for real-time feedback
### 🚆 Trains

---
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/trains/search?from=NDLS&to=MAS&date=2026-11-15` | ✅ | Search trains |
| `POST` | `/trains/book` | ✅ | Book a train |

## 🔐 Default Test Credentials
### 💳 Payment

After registration, you can log in with any account you create. Sample flight & train data is seeded automatically on first backend run.
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/payment/process` | ✅ | Process a payment |

### 📁 Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/bookings` | ✅ | Get all user bookings |
| `GET` | `/bookings/:id/ticket` | ✅ | Get single ticket details |
| `POST` | `/bookings/:id/cancel` | ✅ | Cancel a booking |

> All protected routes require: `Authorization: Bearer <jwt_token>`

---

## 📌 Environment Variables (Optional)
## 🗄️ Database Schema

Create a `.env` file in the project root:
```js
// users collection
{
  _id       : ObjectId,
  name      : String,
  email     : String (unique),
  password  : String (bcrypt hash),
  created_at: Date
}

```env
MONGO_URI=mongodb://localhost:27017/reservation_db
JWT_SECRET_KEY=your_super_secret_key_here
JWT_EXPIRY_HOURS=24
FLASK_DEBUG=True
// bookings collection
{
  _id          : ObjectId,
  user_id      : ObjectId (ref: users),
  type         : "flight" | "train",
  pnr          : String (unique, auto-generated),
  source       : String,
  destination  : String,
  travel_date  : String,
  passengers   : [{ name, age, gender }],
  travel_class : String,         // flights
  coach_type   : String,         // trains
  total_amount : Number,
  status       : "confirmed" | "cancelled",
  created_at   : Date
}

// payments collection
{
  _id         : ObjectId,
  booking_id  : ObjectId (ref: bookings),
  user_id     : ObjectId (ref: users),
  amount      : Number,
  method      : "credit_card" | "debit_card" | "upi",
  status      : "success" | "failed",
  created_at  : Date
}
```

---

## 🎨 UI Overview

```
┌─────────────────────────────────────────┐
│  🌑 Dark Theme  •  Glassmorphism Cards  │
│  Gradient Accents  •  Smooth Animations │
├─────────────────────────────────────────┤
│                                         │
│  /login          →  Login Page          │
│  /register       →  Register Page       │
│  /dashboard      →  Home Dashboard      │
│  /airline        →  Flight Booking      │
│                     Step 1: Search      │
│                     Step 2: Select      │
│                     Step 3: Passengers  │
│                     Step 4: Review      │
│  /railway        →  Train Booking       │
│                     (same 4-step flow)  │
│  /payment        →  Payment + Confirm   │
│  /bookings       →  Booking History     │
│                                         │
└─────────────────────────────────────────┘
```

**Design Highlights**
- 🌑 Premium **dark theme** with CSS variables
- 💎 **Glassmorphism** cards with blur & transparency
- 🎞️ Fade-in & slide animations on page transitions
- 🧭 **Multi-step wizard** UI for booking flows
- 🎫 **Ticket modal** with browser print support
- 📱 Fully **responsive** for mobile & desktop
- 🔔 **Toast notifications** for all user actions

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request
Contributions are always welcome! Here's how:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/airline-railway-reservation.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes and commit
git add .
git commit -m "feat: add your feature description"

# 5. Push to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
```

**Commit Message Convention:**
```
feat:     New feature
fix:      Bug fix
docs:     Documentation update
style:    Formatting, no code change
refactor: Code restructure
test:     Add or update tests
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
```
MIT License

---
Copyright (c) 2026 Your Name

## 👨‍💻 Author
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

Built with ❤️ as a full-stack reservation platform.
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

| Contact | Link |
|---------|------|
| GitHub  | [@your-username](https://github.com/your-username) |
| Email   | your-email@example.com |

---

> ⭐ Star this repo if you find it useful!
<div align="center">

**Made with ❤️ using React + Flask + MongoDB**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=your-username.airline-railway-reservation)
&nbsp;
⭐ **Star this repo if it helped you!** ⭐

</div>
