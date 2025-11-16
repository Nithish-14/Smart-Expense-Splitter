import { useAuth } from "../contexts/AuthContext";
export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-blue-500 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">Smart Expense Splitter</h1>
      <div>
        <span className="mr-4">{user?.name}</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </header>
  );
}
