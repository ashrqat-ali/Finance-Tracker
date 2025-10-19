import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./global.scss";
import { useState, useEffect } from "react";

import { Login } from "./components/Auth/login";
import { Signup } from "./components/Auth/signup";

import DashBoard from "./components/Dash/dash";
import Budgets from "./components/Budgets/budgets";
import Home from "./components/Home/home";
import Transactions from "./components/Transactions/transactions";

export default function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const [transactions, setTransactions] = useState(() => {
    if (currentUser) {
      return (
        JSON.parse(localStorage.getItem(`${currentUser.email}_transactions`)) ||
        []
      );
    }
    return JSON.parse(localStorage.getItem("guest_transactions")) || [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `${currentUser.email}_transactions`,
        JSON.stringify(transactions)
      );
    } else {
      localStorage.setItem("guest_transactions", JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route
          path="/login"
          element={
            <Login
              setCurrentUser={setCurrentUser}
              setTransactions={setTransactions}
            />
          }
        />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<DashBoard />}>
          <Route
            path="home"
            element={
              <Home
                transactions={transactions}
                currentUser={currentUser}
                setTransactions={setTransactions}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="transactions"
            element={
              <Transactions
                transactions={transactions}
                setTransactions={setTransactions}
              />
            }
          />
          <Route
            path="budgets"
            element={<Budgets transactions={transactions} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
