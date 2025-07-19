import React from "react";
import { Link, useLocation } from "react-router-dom";

export const DashboardOverview = ({ profile }) => {
  const location = useLocation();

  if (!profile) return null;

  const { name, balance, stats, recentTransactions = [] } = profile;
  const { totalSent, totalReceived, transactionCount } = stats;

  // Convert path like "/dashboard/send" to "Send"
  const routeName = location.pathname.split("/").filter(Boolean).pop();
  const pageTitle =
    routeName === "dashboard"
      ? "Dashboard"
      : routeName.charAt(0).toUpperCase() + routeName.slice(1);

  return (
    <div className="space-y-6">
      {/* Top Bar: Page Title + Greeting */}
      <div className="bg-white shadow-sm px-6 py-4 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        <p className="text-gray-700 text-sm sm:text-base">Hi, {name}</p>
      </div>

      {/* Top Section: Balance + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="rounded-2xl bg-white shadow-md p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">₹{balance}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/dashboard/send"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              Send Money
            </Link>
            <Link
              to="/dashboard/requests"
              className="inline-block px-4 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm font-medium shadow hover:bg-gray-200 transition"
            >
              Request Money
            </Link>
          </div>
        </div>

        {/* Stats Card */}
        <div className="rounded-2xl bg-white shadow-md px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <div className="flex items-center space-x-4">
            <div className="bg-rose-100 text-rose-600 p-3 font-semibold rounded-b-4xl">
              ₹
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sent</p>
              <p className="text-lg font-medium text-gray-800">₹{totalSent}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 font-semibold rounded-b-4xl">
              ₹
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Received</p>
              <p className="text-lg font-medium text-gray-800">
                ₹{totalReceived}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 text-indigo-600 p-3 font-semibold rounded-b-4xl">
              #
            </div>
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-lg font-medium text-gray-800">
                {transactionCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="rounded-2xl bg-white shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <Link
            to="/dashboard/transactions"
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentTransactions.filter((txn) => txn.status === "COMPLETED")
          .length === 0 ? (
          <p className="text-sm text-gray-500">No recent transactions.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentTransactions
              .filter((txn) => txn.status === "COMPLETED")
              .slice(0, 5)
              .map((txn) => (
                <li key={txn.id} className="py-3 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-800">
                      {txn.sender?.name == name ? "Sent to" : "Received from"}{" "}
                      <span className="font-medium">
                        {txn.receiver?.name || txn.sender?.name || "Unknown"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(txn.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        txn.sender?.name == name
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {txn.sender?.name == name ? "-" : "+"}₹{txn.amount}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
