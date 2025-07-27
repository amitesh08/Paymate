import { useEffect, useState } from "react";
import { DashboardOverview } from "../../components/DashboardOverview";
import axios from "axios";

export const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          // `${import.meta.env.VITE_API_URL}/api/v1/users/profile`,
          "/api/v1/users/profile",
          {
            withCredentials: true,
          }
        );
        setProfile(res.data.data);
        setError(null);
      } catch (error) {
        setProfile(null);
        setError(error?.response?.data?.message || "Failed fetching the Data!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <DashboardOverview profile={profile} />
      )}
    </div>
  );
};

export default Dashboard;
