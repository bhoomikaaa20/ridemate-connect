# 🚖 RideMate Connect – MERN Ride Booking System

## 📌 Overview

RideMate Connect is a full-stack ride booking web application built using the **MERN stack (MongoDB, Express, React, Node.js)**.
It supports three roles: **User, Rider, and Admin**, each with dedicated dashboards and functionalities.

---

## 🚀 Features

### 👤 User

* Sign up and login
* Book a ride (pickup & drop)
* View ride history
* Cancel rides

### 🧑‍✈️ Rider

* View available rides
* Accept ride requests
* Mark rides as completed
* View assigned rides

### 👑 Admin

* View all users and riders
* Delete users
* View all rides
* Delete rides
* Monitor system activity

---

## 🛠️ Tech Stack

### Frontend

* React (TypeScript)
* React Router
* Tailwind CSS / ShadCN UI
* Sonner (toast notifications)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication (cookies)

---

## 📁 Project Structure

```
ridemate-connect/
│
├── client/        # React frontend
│
├── server/        # Node.js backend
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.ts
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <your-repo-link>
cd ridemate-connect
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm run dev
```

---

## 🔐 Authentication

* JWT stored in **HTTP-only cookies**
* Role-based access:

  * User → `/dashboard`
  * Rider → `/rider`
  * Admin → `/admin`

---

## 🔄 API Endpoints

### Auth

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Rides

```
POST   /api/rides            # Create ride
GET    /api/rides/user       # User rides
PUT    /api/rides/cancel/:id

GET    /api/rides/available  # Rider
GET    /api/rides/my
PUT    /api/rides/accept/:id
PUT    /api/rides/complete/:id
```

### Admin

```
GET    /api/admin/users
DELETE /api/admin/user/:id

GET    /api/admin/rides
DELETE /api/admin/ride/:id
```

---

## 🧠 Key Concepts Implemented

* Role-based authentication
* REST API design
* Secure password hashing (bcrypt)
* Cookie-based JWT authentication
* MongoDB relationships (user_id, rider_id)
* Full CRUD operations
* State management using React Context

---


## 🚀 Future Improvements

* Payment integration
* Google Maps API (live location)
* Real-time updates using Socket.io
* Ride fare calculation
* Admin analytics dashboard

---


