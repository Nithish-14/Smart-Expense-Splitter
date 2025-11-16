const { isValidObjectId } = require("mongoose");
const Settlement = require("../models/Settlement");
const Expense = require("../models/Expense");
const User = require("../models/User");

exports.addSettlement = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { amount } = req.body;
    const userId = req.user._id;

    if (!isValidObjectId(expenseId) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid expenseId or user" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const settlement = await Settlement.create({
      expense: expenseId,
      paidBy: userId,
      amount,
    });

    return res.status(201).json({ message: "Settlement added successfully", settlement });
  } catch (err) {
    console.error("addSettlement:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.listSettlementsByExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    if (!isValidObjectId(expenseId)) {
      return res.status(400).json({ message: "Invalid expenseId" });
    }

    const expense = await Expense.findById(expenseId).populate("group", "members");
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const requesterId = req.user._id.toString();
    const isMember =
      expense.group &&
      expense.group.members &&
      expense.group.members.map(String).includes(requesterId);
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Not authorized to view settlements for this expense" });
    }

    const settlements = await Settlement.find({ expense: expenseId })
      .populate("paidBy", "name email avatarUrl")
      .sort({ createdAt: 1 }); // oldest first

    return res.status(200).json({ expenseId, settlements });
  } catch (err) {
    console.error("listSettlementsByExpense:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
