const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

// ADD EXPENSE TO A GROUP
router.post(
  "/:groupId",
  auth,
  [
    body("title").notEmpty(),
    body("amount").isFloat({ gt: 0 }),
    body("paidBy").notEmpty(),
    body("splitAmong").isArray({ min: 1 }),
  ],
  validate,
  expenseController.addExpense,
);

// LIST EXPENSES FOR A GROUP
router.get("/:groupId", auth, expenseController.listGroupExpenses);

// GET SINGLE EXPENSE (NEW)
router.get("/:groupId/:expenseId", auth, expenseController.getExpense);

// UPDATE EXPENSE (NEW)
router.put(
  "/:groupId/:expenseId",
  auth,
  [
    body("title").optional().notEmpty(),
    body("amount").optional().isFloat({ gt: 0 }),
    body("paidBy").optional().notEmpty(),
    body("splitAmong").optional().isArray(),
  ],
  validate,
  expenseController.updateExpense,
);

// DELETE EXPENSE (NEW)
router.delete("/:groupId/:expenseId", auth, expenseController.deleteExpense);

module.exports = router;
