const Expense = require("../models/Expense");
const Settlement = require("../models/Settlement");
const Group = require("../models/Group");

/**
 * Export all group expenses as CSV
 */
exports.exportGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    // get group to fetch createdBy
    const group = await Group.findById(groupId).populate("createdBy", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    // fetch expenses
    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("participants.user", "name email");

    let csvRows = [];
    csvRows.push("expenseId,title,amount,paidBy,participant,share,paid,groupCreatedBy,createdAt");

    expenses.forEach((exp) => {
      exp.participants.forEach((p) => {
        csvRows.push(
          `${exp._id},${exp.title},${exp.amount},${exp.paidBy?.name || ""},${p.user?.name || ""},${p.share},${p.paid},${group?.createdBy?.name || ""},${exp.createdAt.toISOString()}`,
        );
      });
    });

    const csvData = csvRows.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=group_${groupId}_expenses.csv`);
    res.send(csvData);
  } catch (err) {
    console.error("exportGroupExpenses:", err);
    res.status(500).json({ message: "Error generating CSV report" });
  }
};

/**
 * Group summary report: total paid, total share, net balance per user
 */
exports.groupSummaryReport = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    // initialize summary
    const summary = {};
    group.members.forEach((m) => {
      summary[m._id] = {
        user: { _id: m._id, name: m.name },
        totalPaid: 0,
        totalShare: 0,
        balance: 0,
      };
    });

    const expenses = await Expense.find({ group: groupId }).populate(
      "participants.user",
      "name email",
    );

    // calculate totalPaid & totalShare
    expenses.forEach((exp) => {
      exp.participants.forEach((p) => {
        summary[p.user._id].totalShare += p.share;
        summary[p.user._id].totalPaid += p.paid;
      });
    });

    // include settlements if needed
    const settlements = await Settlement.find({}).populate("paidBy", "_id");
    settlements.forEach((s) => {
      if (summary[s.paidBy._id]) summary[s.paidBy._id].balance += s.amount;
    });

    // final balance = totalPaid + settlements - totalShare
    Object.values(summary).forEach((s) => {
      s.balance = s.totalPaid + s.balance - s.totalShare;
    });

    res.status(200).json({ groupId, summary: Object.values(summary) });
  } catch (err) {
    console.error("groupSummaryReport:", err);
    res.status(500).json({ message: "Error generating group summary" });
  }
};

/**
 * Detailed balances: who owes whom
 */
exports.groupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Step 1: net balance per user
    const balances = {};
    group.members.forEach((m) => (balances[m._id] = 0));

    const expenses = await Expense.find({ group: groupId }).populate(
      "participants.user",
      "_id name",
    );

    // calculate initial net balances
    expenses.forEach((exp) => {
      exp.participants.forEach((p) => {
        balances[p.user._id] -= p.share; // they owe this
      });
      balances[exp.paidBy] += exp.amount; // paidBy receives
    });

    const settlements = await Settlement.find({}).populate("paidBy", "_id");
    settlements.forEach((s) => {
      balances[s.paidBy._id] -= s.amount; // subtract settlements paid
    });

    // Step 2: convert to from → to → amount list
    const owes = [];
    const debtors = [];
    const creditors = [];

    Object.keys(balances).forEach((uid) => {
      const bal = balances[uid];
      if (bal < 0) debtors.push({ user: uid, amount: -bal });
      else if (bal > 0) creditors.push({ user: uid, amount: bal });
    });

    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      owes.push({
        from: group.members.find((m) => m._id.equals(debtor.user)),
        to: group.members.find((m) => m._id.equals(creditor.user)),
        amount,
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount <= 0) i++;
      if (creditor.amount <= 0) j++;
    }

    res.status(200).json(owes);
  } catch (err) {
    console.error("groupBalances:", err);
    res.status(500).json({ message: "Error generating balances" });
  }
};
