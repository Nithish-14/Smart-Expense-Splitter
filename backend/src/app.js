const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { json, urlencoded } = require("express");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const groupRoutes = require("./routes/groups");
const expenseRoutes = require("./routes/expenses");
const reportRoutes = require("./routes/reports");
const errorHandler = require("./middleware/errorHandler");
const settlementRoutes = require("./routes/settlementRoutes");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "Smart Expense API" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settlements", settlementRoutes);

app.use(errorHandler);

module.exports = app;
