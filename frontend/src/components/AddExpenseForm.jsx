import { useState, useEffect } from "react";
import api from "../services/api";

export default function AddExpenseForm({ group, expense, onExpenseUpdated }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!expense) {
      setTitle("");
      setAmount("");
      setPaidBy("");

      setParticipants(
        group?.members.map((m) => ({ user: m._id, name: m.name })) || []
      );
    } else {
      setTitle(expense.title);
      setAmount(expense.amount);
      setPaidBy(expense.paidBy?._id || "");
      setParticipants(
        expense.participants.map((p) => ({
          user: p.user,
          name: group.members.find((m) => m._id === p.user)?.name || p.user,
        }))
      );
    }
  }, [expense, group]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !paidBy) {
      setError("Please fill all fields and select who paid");
      return;
    }

    try {
      setError("");
      const payload = {
        title,
        amount: parseFloat(amount),
        paidBy,
        splitAmong: group.members.map((m) => m._id),
      };

      const res = await api.post(`/expenses/${group._id}`, payload);
      onExpenseUpdated(res.data);

      setTitle("");
      setAmount("");
      setPaidBy("");
    } catch (err) {
      setError(err.response?.data?.message || "Error saving expense");
    }
  };

  if (!group?.members) return null;

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />

      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
        required
      >
        <option value="">Select Paid By</option>
        {group.members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>

      <h3 className="font-bold mb-2">Participants</h3>
      <ul className="mb-2">
        {participants.map((p) => (
          <li key={p.user} className="p-1 border rounded mb-1">
            {p.name}
          </li>
        ))}
      </ul>

      <button
        type="submit"
        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
      >
        {expense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
