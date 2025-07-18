import { Link, Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

const ProtectedRoute = () => {
  const { user, loading, error } = useUser();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-muted">
        <p className="text-gray-600 text-base font-medium">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-600 text-lg font-medium">
          {error || "Session expired. Please sign in again."}
        </p>
        <Link to="/signin">
          <button className="bg-black text-white px-5 py-2 rounded-2xl shadow-sm hover:shadow-md transition duration-200 text-sm font-semibold">
            Sign In Again
          </button>
        </Link>
      </div>
    );

  if (!user) return <Navigate to="/signin" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
