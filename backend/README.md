# Smart Expense Splitter - Backend

## Project Overview

Smart Expense Splitter is a backend application built with Node.js, Express, and MongoDB. It allows users to create groups, add expenses, track who owes whom, export reports, and settle payments.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- express-validator for input validation
- Postman for API testing

## Folder Structure

```
backend/
├─ src/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  └─ app.js
├─ package.json
└─ README.md
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Nithish-14/Smart-Expense-Splitter.git
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Setup `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart_expense
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

4. Start MongoDB locally (via MongoDB Compass or `mongod`):

```bash
mongod
```

5. Start the server:

```bash
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Groups

- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups of logged-in user
- `POST /api/groups/:groupId/add-user` - Add user to group

### Expenses

- `POST /api/expenses` - Create expense
- `GET /api/expenses/group/:groupId` - Get all group expenses
- `GET /api/expenses/:expenseId` - Get single expense

### Settlements

- `POST /api/settlements/pay` - Pay for an expense
- `GET /api/settlements/expense/:expenseId` - Get all payments of an expense
- `POST /api/settlements/settle/:expenseId` - Mark full settlement

### Reports

- `GET /api/reports/group/:groupId/expenses.csv` - Export group expenses CSV
- `GET /api/reports/group/:groupId/summary` - Summary of total paid, total share, balance per user
- `GET /api/reports/group/:groupId/balances` - Who owes whom

## Testing

Use Postman to test all routes. Include the `Authorization: Bearer <JWT>` header for protected routes.
