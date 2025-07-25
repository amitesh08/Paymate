import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Send, HandCoins, LogOut, ReceiptText } from "lucide-react";
import axios from "axios";
import useUser from "../hooks/useUser";
import Avatar from "./Avatar";
import toast, { Toaster } from "react-hot-toast";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/signin");
    } catch (error) {
      toast.error(error.response?.data || "failed to logout");
    }
  };

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-md transition ${
      location.pathname === path
        ? "bg-gray-100 text-black font-semibold"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
    }`;

  return (
    <aside className="w-20 md:w-64 bg-white border-r h-full p-4 flex flex-col justify-between shadow-md transition-all duration-300">
      <Toaster />
      <div>
        {/* Logo */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          <span className="md:block hidden text-blue-600">Paymate</span>
          <span className="md:hidden block text-blue-600">P</span>
        </h2>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            <Home size={20} />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link to="/dashboard/send" className={linkClass("/dashboard/send")}>
            <Send size={20} />
            <span className="hidden md:inline">Send Money</span>
          </Link>
          <Link
            to="/dashboard/requests"
            className={linkClass("/dashboard/requests")}
          >
            <HandCoins size={20} />
            <span className="hidden md:inline">Requests</span>
          </Link>
          <Link
            to="/dashboard/transactions"
            className={linkClass("/dashboard/transactions")}
          >
            <ReceiptText size={20} />
            <span className="hidden md:inline">Transactions</span>
          </Link>
        </nav>
      </div>

      {/* User Info + Logout */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 md:flex-row flex-col">
          <div className="flex-shrink-0">
            <Avatar url={user.avatar} name={user.name} />
          </div>
          <div className="hidden md:block min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition md:justify-start justify-center w-full pl-2 py-1 rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};
