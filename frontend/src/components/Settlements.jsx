import { useState, useEffect } from "react";
import api from "../services/api";
import Loader from "./Loader";
import Error from "./Error";
import SettleExpense from "./SettleExpense";

export default function Settlements({ group }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all expenses in the group
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

  // Fetch settlements for selected expense
  useEffect(() => {
    if (!selectedExpense) return;
    const fetchSettlements = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/settlements/expense/${selectedExpense._id}`
        );
        setSettlements(res.data.settlements);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load settlements");
      } finally {
        setLoading(false);
      }
    };
    fetchSettlements();
  }, [selectedExpense]);

  if (!group) return <div>Select a group to see settlements</div>;
  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="font-bold mb-2">Settlements</h2>

      <select
        value={selectedExpense?._id || ""}
        onChange={(e) => {
          const exp = expenses.find((ex) => ex._id === e.target.value);
          setSelectedExpense(exp);
        }}
        className="p-2 border rounded mb-4 w-full"
      >
        <option value="">Select Expense</option>
        {expenses.map((exp) => (
          <option key={exp._id} value={exp._id}>
            {exp.title} - {exp.amount}
          </option>
        ))}
      </select>

      {selectedExpense && (
        <>
          <SettleExpense
            expense={selectedExpense}
            onSettlementSuccess={() => {
              setSelectedExpense({ ...selectedExpense });
            }}
          />

          <h3 className="font-bold mt-4 mb-2">
            Settlements for {selectedExpense.title}
          </h3>
          {settlements.length === 0 ? (
            <p className="text-gray-500">No settlements yet.</p>
          ) : (
            <ul>
              {settlements.map((s) => (
                <li key={s._id} className="border-b p-2">
                  {s.paidBy.name} paid {s.amount}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
