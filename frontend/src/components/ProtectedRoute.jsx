import { Link, Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";

const ProtectedRoute = () => {
  const { user, loading, error, isInitializing } = useUser();

  // Show loading during initial fetch or when still initializing
  if (loading || isInitializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error page only if there's an error AND no user
  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Session Expired
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "Your session has expired. Please sign in again to continue."}
          </p>
          <Link to="/signin">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium">
              Sign In Again
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Redirect to signin if no user
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
