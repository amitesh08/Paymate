import axios from "axios";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
          {
            withCredentials: true,
          }
        );
        setUser(res.data.user);
        setError(null);
      } catch (err) {
        setUser(null);
        // setError(err.response?.data?.message); for development to check errors
        setError(
          err.response?.data?.message ||
            "Session expired. Please sign in again."
        );
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    };

    fetchUser();
  }, []);

  // Enhanced setUser function that also updates loading states
  const updateUser = (userData) => {
    setUser(userData);
    setError(null);
    // If we're setting a user, we're no longer loading
    if (userData) {
      setLoading(false);
      setIsInitializing(false);
    }
  };

  // Clear error when user is set
  const clearError = () => {
    setError(null);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: updateUser,
        loading,
        error,
        isInitializing,
        clearError,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
