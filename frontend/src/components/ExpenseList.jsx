import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "./Loader";
import Error from "./Error";

export default function ExpenseList({ group, onSelectExpense }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!group) return;

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/expenses/${group._id}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        setExpenses(res.data.expenses);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [group]);

  if (!group) return <div>Select a group to see expenses</div>;
  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Expenses</h2>
      <ul>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses found for this group.</p>
        ) : (
          expenses.map((exp) => (
            <li
              key={exp._id}
              className="border-b p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectExpense(exp)}
            >
              {exp.title} - {exp.amount} - Paid By:{" "}
              {exp.paidBy?.name
                ? exp.paidBy.name
                : group.members.find(
                    (m) => String(m._id) === String(exp.paidBy)
                  )?.name || "Unknown"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
