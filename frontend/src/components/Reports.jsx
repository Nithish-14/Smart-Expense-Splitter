import { useState } from "react";
import api from "../services/api";
import Loader from "./Loader";
import Error from "./Error";

export default function Reports({ group }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExportCSV = async () => {
    if (!group) return;
    setLoading(true);
    try {
      const res = await api.get(`/reports/group/${group._id}/expenses.csv`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${group.name}-expenses.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to export CSV");
    } finally {
      setLoading(false);
    }
  };

  if (!group) return <div>Select a group to see reports</div>;
  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h2 className="font-bold mb-2">Reports for {group.name}</h2>
      <button
        onClick={handleExportCSV}
        className="bg-purple-500 text-white px-3 py-1 rounded"
      >
        Export CSV
      </button>
    </div>
  );
}
