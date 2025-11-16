import { useState, useEffect } from "react";
import Header from "./Header";
import GroupList from "./GroupList";
import ExpenseList from "./ExpenseList";
import AddGroupForm from "./AddGroupForm";
import AddExpenseForm from "./AddExpenseForm";
import Reports from "./Reports";
import Settlements from "./Settlements";
import SettleExpense from "./SettleExpense";

export default function Dashboard() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [refreshGroups, setRefreshGroups] = useState(false);
  const [refreshExpenses, setRefreshExpenses] = useState(false);
  const [activeTab, setActiveTab] = useState("expenses");

  const handleGroupAdded = () => setRefreshGroups((prev) => !prev);
  const handleExpenseUpdated = () => setRefreshExpenses((prev) => !prev);

  useEffect(() => {
    setSelectedExpense(null);
  }, [selectedGroup]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <AddGroupForm onGroupAdded={handleGroupAdded} />
          <GroupList
            key={refreshGroups}
            onSelectGroup={setSelectedGroup}
            activeGroup={selectedGroup}
          />
        </div>
        <div className="md:col-span-2">
          {selectedGroup ? (
            <div className="mb-4">
              <div className="flex space-x-2 mb-2">
                <button
                  onClick={() => setActiveTab("expenses")}
                  className={`px-3 py-1 rounded ${
                    activeTab === "expenses"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`px-3 py-1 rounded ${
                    activeTab === "reports"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => setActiveTab("settlements")}
                  className={`px-3 py-1 rounded ${
                    activeTab === "settlements"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Settlements
                </button>
              </div>

              {activeTab === "expenses" && (
                <>
                  <AddExpenseForm
                    group={selectedGroup}
                    onExpenseUpdated={handleExpenseUpdated}
                  />
                  <ExpenseList
                    key={refreshExpenses}
                    group={selectedGroup}
                    onSelectExpense={setSelectedExpense}
                  />
                </>
              )}

              {activeTab === "reports" && <Reports group={selectedGroup} />}
              {activeTab === "settlements" && (
                <Settlements group={selectedGroup} />
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-10">
              Select a group to see the dashboard
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
