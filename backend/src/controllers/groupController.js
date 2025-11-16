const Group = require("../models/Group");
const Expense = require("../models/Expense");

exports.createGroup = async (req, res) => {
  try {
    const { name, description, members, currency, categories } = req.body;

    // Add creator to members list automatically if not present
    if (!members.includes(req.user._id.toString())) {
      members.push(req.user._id);
    }

    const group = await Group.create({
      name,
      description,
      members,
      currency,
      categories,
      createdBy: req.user._id,
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).populate("members", "_id name email");
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("members", "_id name email").exec();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate("members", "_id name email").exec();
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.groupId, createdBy: req.user._id },
      { $set: req.body },
      { new: true },
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({
      message: "Group updated successfully",
      group,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.groupSummary = async (req, res, next) => {
  const groupId = req.params.groupId;
  const expenses = await Expense.find({ group: groupId }).populate(
    "participants.user paidBy",
    "name email",
  );
  // compute balances
  const balances = {};
  expenses.forEach((e) => {
    e.participants.forEach((p) => {
      balances[p.user._id] = (balances[p.user._id] || 0) - p.share;
    });
    balances[e.paidBy._id] = (balances[e.paidBy._id] || 0) + e.amount;
  });
  // convert to readable map with object ids as strings
  res.json({ balances, expenses });
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({
      _id: req.params.groupId,
      createdBy: req.user._id,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
