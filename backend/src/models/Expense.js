const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  share: { type: Number, required: true }, // amount this participant owes
  paid: { type: Number, required: true }, // amount this participant paid
});

const ExpenseSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [ParticipantSchema],
    category: { type: String },
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", ExpenseSchema);
