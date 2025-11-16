import { useState, useEffect } from "react";
import api from "../services/api";

export default function AddGroupForm({ onGroupAdded }) {
  const [title, setTitle] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setAllUsers(res.data);
      } catch (err) {
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const addMember = () => {
    if (!selectedUser) {
      setError("Select a user to add");
      return;
    }
    if (selectedMembers.includes(selectedUser)) {
      setError("User already added");
      return;
    }
    setSelectedMembers([...selectedMembers, selectedUser]);
    setSelectedUser("");
    setError("");
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || selectedMembers.length === 0) {
      setError("Please enter a group title and select at least one member");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/groups", {
        name: title,
        members: selectedMembers,
      });

      setTitle("");
      setSelectedMembers([]);
      onGroupAdded(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white p-4 rounded shadow w-full max-w-md"
      onSubmit={handleSubmit}
    >
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        type="text"
        placeholder="Group Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
        required
      />

      {/* Select Users */}
      <div className="flex space-x-2 mb-2">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">Select a user to add</option>
          {allUsers
            .filter((u) => !selectedMembers.includes(u._id))
            .map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
        </select>
        <button
          type="button"
          onClick={addMember}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Add
        </button>
      </div>

      {/* Selected Members */}
      {selectedMembers.length > 0 && (
        <div className="mb-2">
          <p className="font-bold mb-1">Selected Members:</p>
          <ul>
            {selectedMembers.map((id) => {
              const user = allUsers.find((u) => u._id === id);
              return (
                <li key={id} className="flex justify-between items-center mb-1">
                  <span>{user?.name || id}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white p-2 rounded mt-2"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
}
