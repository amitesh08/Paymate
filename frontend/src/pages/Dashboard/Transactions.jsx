import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ExportPDFButton from "../../components/ExportPDFButton";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL"); // SENT, RECEIVED, ALL
  const [sortOrder, setSortOrder] = useState("DESC"); // ASC or DESC

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/transactions/histroy", //FIX: IN Backend history
          {
            withCredentials: true,
          }
        );

        setTransactions(res.data?.transactions || []);
        toast.success(res.data?.message || "Transactions fetched successfully");
      } catch {
        toast.error("Could not fetch transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions
    .filter((txn) => {
      if (filterType === "ALL") return true;
      return txn.type === filterType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster /> {/* ✅ Needed to show toast notifications */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Your Transactions
      </h1>
      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 sm:flex-none border px-3 py-2 rounded-md text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All</option>
            <option value="SENT">Sent</option>
            <option value="RECEIVED">Received</option>
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="flex-1 sm:flex-none border px-3 py-2 rounded-md text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>

        {/* Export PDF Button */}
        <div className="w-full sm:w-auto">
          <ExportPDFButton />
        </div>
      </div>
      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : filteredTransactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-white shadow-sm rounded-lg p-4 border border-gray-200"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                {/* Who Sent/Received */}
                <div className="flex-1 min-w-0">
                  <span className="capitalize font-medium text-sm text-gray-700 block truncate">
                    {txn.type === "SENT" ? "Sent to" : "Received from"}{" "}
                    {txn.type === "SENT"
                      ? txn.receiver?.name || "Unknown"
                      : txn.sender?.name || "Unknown"}
                  </span>

                  {/* Amount - Show prominently on mobile */}
                  <div className="mt-1 text-blue-600 font-semibold text-lg">
                    ₹{txn.amount}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-1 sm:gap-2 items-center flex-wrap sm:flex-nowrap flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                      txn.type === "SENT"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {txn.type}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                      txn.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {txn.status}
                  </span>
                </div>
              </div>

              {/* Note and Date */}
              <div className="mt-2 space-y-1">
                {txn.note && (
                  <div className="text-gray-500 text-sm italic">
                    Note: {txn.note}
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  {new Date(txn.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
