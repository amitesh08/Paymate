import axios from "axios";
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
        setError(null);
      } catch {
        setUser(null);
        // setError(err.response?.data?.message); for developement to check erros
        setError("Session expired. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
