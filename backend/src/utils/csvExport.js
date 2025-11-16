const createCsvWriter = require("csv-writer").createObjectCsvStringifier;

function exportExpensesCSV(expenses) {
  const header = [
    { id: "date", title: "Date" },
    { id: "group", title: "Group" },
    { id: "title", title: "Title" },
    { id: "amount", title: "Amount" },
    { id: "paidBy", title: "PaidBy" },
    { id: "participants", title: "Participants" },
    { id: "category", title: "Category" },
  ];
  const csvStringifier = createCsvWriter({ header });
  const records = expenses.map((e) => ({
    date: e.date.toISOString(),
    group: e.group.name || e.group,
    title: e.title,
    amount: e.amount,
    paidBy: e.paidBy.name || e.paidBy,
    participants: e.participants.map((p) => p.user.name || p.user).join("|"),
    category: e.category,
  }));
  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
}

module.exports = { exportExpensesCSV };
