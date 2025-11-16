const express = require("express");
const auth = require("../middleware/auth");
const reportController = require("../controllers/reportController");

const router = express.Router();

// Export all expenses in a group as CSV
router.get("/group/:groupId/expenses.csv", auth, reportController.exportGroupExpenses);

// Get summary report for a group (balances for each user)
router.get("/group/:groupId/summary", auth, reportController.groupSummaryReport);

// Get detailed balances between users inside group
router.get("/group/:groupId/balances", auth, reportController.groupBalances);

module.exports = router;
