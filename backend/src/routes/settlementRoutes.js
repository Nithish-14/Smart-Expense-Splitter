const express = require("express");
const auth = require("../middleware/auth");
const { addSettlement, listSettlementsByExpense } = require("../controllers/settlementController");

const router = express.Router();

// POST /expense/:expenseId/settlements
router.post("/expense/:expenseId/settle", auth, addSettlement);

// GET /api/settlements/expense/:expenseId
router.get("/expense/:expenseId", auth, listSettlementsByExpense);

module.exports = router;
