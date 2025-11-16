import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import Error from "./Error";

export default function GroupList({ onSelectGroup, activeGroup }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await api.get("/groups/my");
        setGroups(res.data.groups || res.data); // in case API returns {groups: [...]}
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load groups");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (groups.length === 0)
    return <p className="text-gray-500">No groups found.</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">Groups</h2>
      <ul>
        {groups.map((group) => {
          const isActive = activeGroup?._id === group._id;
          return (
            <li
              key={group._id}
              className={`border-b p-2 cursor-pointer hover:bg-gray-100 ${
                isActive ? "bg-blue-100 font-bold" : ""
              }`}
              onClick={() => onSelectGroup(group)}
            >
              {group.name} ({group.members.length} members)
            </li>
          );
        })}
      </ul>
    </div>
  );
}
