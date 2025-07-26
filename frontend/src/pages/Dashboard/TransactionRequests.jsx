import axios from "axios";
import { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";

export default function TransactionRequests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const incomingRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/requests/incoming`,
        {
          withCredentials: true,
        }
      );

      const outgoingRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/requests/outgoing`,
        {
          withCredentials: true,
        }
      );

      setIncoming(incomingRes?.data?.requests || []);
      setOutgoing(outgoingRes?.data?.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/requests/respond`,
        {
          requestId,
          action,
        },
        {
          withCredentials: true,
        }
      );
      fetchRequests(); // Refresh data after response
    } catch (err) {
      console.error("Failed to respond to request", err);
    }
  };

  const activeRequests = activeTab === "incoming" ? incoming : outgoing;
  const pendingCountIncoming = incoming.filter(
    (r) => r.status === "PENDING"
  ).length;
  const pendingCountOutgoing = outgoing.filter(
    (r) => r.status === "PENDING"
  ).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Transaction Requests</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="flex space-x-2">
          <button
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium transition ${
              activeTab === "incoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming
          </button>
          <button
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium transition ${
              activeTab === "outgoing"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("outgoing")}
          >
            Outgoing
          </button>
        </div>

        <span className="text-sm text-gray-500 text-center sm:text-right">
          Pending:{" "}
          <strong>
            {activeTab === "incoming"
              ? pendingCountIncoming
              : pendingCountOutgoing}
          </strong>
        </span>
      </div>

      {activeRequests.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {[...activeRequests]
            .sort((a, b) => {
              if (a.status === "PENDING" && b.status !== "PENDING") return -1;
              if (a.status !== "PENDING" && b.status === "PENDING") return 1;
              return 0;
            })
            .map((req) => {
              const user = activeTab === "incoming" ? req.sender : req.receiver;

              return (
                <div
                  key={req.id}
                  className={`rounded-xl px-4 sm:px-5 py-4 shadow-md transition-transform hover:scale-[1.01] hover:shadow-lg ${
                    req.status !== "PENDING"
                      ? "opacity-60 bg-gray-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    {/* User Info Section */}
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                      <Avatar url={user.avatar} name={user.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <p className="font-medium truncate">
                              {user?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user?.email}
                            </p>
                            <p className="text-sm mt-1">
                              ₹{req.amount} • {req.note || "No note"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {req.createdAt}
                            </p>
                          </div>

                          {/* Status Badge - Right side on larger screens */}
                          <div className="mt-2 sm:mt-0 sm:ml-4 flex sm:justify-end">
                            <span
                              className={`text-xs font-medium inline-block px-2 py-1 rounded-full ${
                                req.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : req.status === "ACCEPTED"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {activeTab === "incoming" && req.status === "PENDING" && (
                      <div className="flex space-x-2 w-full sm:w-auto sm:ml-4">
                        <button
                          onClick={() => handleRespond(req.id, "ACCEPT")}
                          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespond(req.id, "REJECT")}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
