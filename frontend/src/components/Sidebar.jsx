import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Send, HandCoins, LogOut, ReceiptText } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-md transition ${
      location.pathname === path
        ? "bg-gray-100 text-black font-semibold"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    }`;

  return (
    <aside className="w-64 bg-white border-r h-full p-6 flex flex-col justify-between shadow-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Paymate</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <Home size={18} />
            Home
          </Link>
          <Link to="/dashboard/send" className={linkClass("/dashboard/send")}>
            <Send size={18} />
            Send Money
          </Link>
          <Link
            to="/dashboard/requests"
            className={linkClass("/dashboard/requests")}
          >
            <HandCoins size={18} />
            Requests
          </Link>
          <Link
            to="/dashboard/transactions"
            className={linkClass("/dashboard/transactions")}
          >
            <ReceiptText size={18} />
            Transactions
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};
