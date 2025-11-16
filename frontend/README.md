# Smart Expense Splitter Frontend (Vite + React)

## Overview

This is the frontend application for the Expense Manager project, built using **React** and **Vite**. It allows users to manage groups, add expenses, view reports, and settle payments.

## Features

- User authentication (Login/Signup)
- Group management (create, view, select groups)
- Add and list expenses
- Select who paid and see participants
- Reports and settlements

## Tech Stack

- React 18
- Vite
- Tailwind CSS (for styling)
- Axios (for API requests)
- React Router Dom (for routing)

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ExpenseManager
```

> **Note:** All Vite environment variables **must** start with `VITE_`.

## Installation

1. Clone the repository

```bash
git clone https://github.com/Nithish-14/Smart-Expense-Splitter
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file as described above
4. Run the development server

```bash
npm run dev
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | Build production-ready files |
| `npm run preview` | Preview production build     |

## Folder Structure

```
frontend/
│
├─ public/                 # Static assets
├─ src/
│  ├─ components/          # React components
│  ├─ pages/               # Login, Signup pages
│  ├─ services/            # API calls (Axios)
│  ├─ contexts/            # AuthContext
│  ├─ App.jsx              # Main App component
│  └─ main.jsx             # Entry point
├─ .env                    # Environment variables
├─ package.json
└─ vite.config.js
```

## API Integration

All API calls use **Axios** with `VITE_API_BASE_URL` as the base URL. Example:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

## Notes

- Restart Vite whenever `.env` changes.
- Ensure backend server is running at `VITE_API_BASE_URL`.
- Use React DevTools and console for debugging.

## Contribution

1. Fork the repository
2. Create a new branch `feature/your-feature`
3. Make your changes
4. Commit & push
5. Create a Pull Request
