import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import SendMoney from "./pages/Dashboard/SendMoney";
import TransactionRequests from "./pages/Dashboard/TransactionRequests";
import Transactions from "./pages/Dashboard/Transactions";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="send" element={<SendMoney />} />
          <Route path="requests" element={<TransactionRequests />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
