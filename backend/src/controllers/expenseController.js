const Expense = require("../models/Expense");
const Group = require("../models/Group");
const { splitEqual } = require("../utils/splitter");
const { isValidObjectId } = require("mongoose");

exports.addExpense = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const {
      title,
      amount,
      split = "equal",
      participants = [],
      paidBy,
      category,
      date,
      customShares,
    } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // participants should include user ids; ensure payer is in participants
    const persons = participants.length ? participants : group.members.map((m) => m.toString());
    if (!persons.includes(req.user._id.toString())) persons.push(req.user._id.toString());

    let shares = [];
    if (split === "equal") {
      shares = splitEqual(amount, persons.length);
    } else if (split === "custom" && Array.isArray(customShares)) {
      shares = customShares; // assume validated
    } else if (split === "percentage" && Array.isArray(customShares)) {
      // customShares in percent values; convert to amounts
      shares = customShares.map((p) => Math.round((p / 100) * amount * 100) / 100);
    } else {
      shares = splitEqual(amount, persons.length);
    }

    const participantsDoc = persons.map((id, idx) => ({
      user: id,
      share: shares[idx] || 0,
      paid: id === req.user._id.toString() ? amount : 0,
    }));

    const expense = await Expense.create({
      group: groupId,
      title,
      amount,
      paidBy: paidBy,
      participants: participantsDoc,
      category,
      date,
    });
    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
};

exports.listGroupExpenses = async (req, res, next) => {
  const expenses = await Expense.find({ group: req.params.groupId }).populate(
    "participants.user paidBy",
    "name email",
  );
  res.json({ expenses });
};

exports.getExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;

    if (!isValidObjectId(groupId) || !isValidObjectId(expenseId)) {
      return res.status(400).json({ message: "Invalid groupId or expenseId" });
    }

    const expense = await Expense.findOne({
      _id: expenseId,
      group: groupId,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  return res.status(400).json({
    message: "Expenses cannot be updated. Use settlements to handle payments.",
  });
};

exports.deleteExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;

    const deleted = await Expense.findOneAndDelete({
      _id: expenseId,
      group: groupId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
