import { useState } from "react";
import api from "../services/api";

export default function SettleExpense({ expense, onSettlementSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!expense) return <div>Select an expense to settle</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Enter a valid amount to settle");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post(`/settlements/expense/${expense._id}/settle`, {
        amount: parseFloat(amount),
      });

      setSuccess("Expense settled successfully!");
      setAmount("");
      if (onSettlementSuccess) onSettlementSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to settle expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4 w-96">
      <h3 className="font-bold mb-2">Settle Expense: {expense.title}</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded"
          min="0"
          step="0.01"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Settling..." : "Settle Expense"}
        </button>
      </form>
    </div>
  );
}
