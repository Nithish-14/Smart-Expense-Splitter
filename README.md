# Smart Expense Splitter

Smart Expense Splitter is a full-stack application that helps users manage shared expenses efficiently. Users can create groups, add expenses, track who owes whom, export reports, and settle payments.

This repository contains both the **backend** (Node.js + Express + MongoDB) and **frontend** (React + Vite) applications.

---

## 🗂 Project Structure

```
Smart-Expense-Splitter/
│
├─ backend/                 # Backend API (Node.js + Express + MongoDB)
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ app.js
│  ├─ package.json
│  └─ README.md
│
├─ frontend/                # Frontend application (React + Vite)
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ contexts/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ .env
│  ├─ package.json
│  └─ vite.config.js
└─ README.md                # Root README (this file)
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/Nithish-14/Smart-Expense-Splitter.git
cd Smart-Expense-Splitter
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_expense
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Start MongoDB locally (via MongoDB Compass or `mongod`) and run the server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ExpenseManager
```

Run the frontend development server:

```bash
npm run dev
```

Now open the app in your browser (default: `http://localhost:5173`).

---

## 🔗 Features

- User authentication (Login/Signup)
- Group management (create, view, select groups)
- Add and list expenses
- Select who paid and see participants
- View balances, settle payments, and generate CSV reports

---

## 🧩 Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, express-validator
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router

---

## 📌 Notes

- Ensure backend server is running before using the frontend.
- Restart Vite whenever `.env` changes.
- Use Postman to test API endpoints if needed.

---
