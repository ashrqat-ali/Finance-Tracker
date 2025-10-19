import React, { useMemo, useState, useEffect } from "react";
import "./home.scss";
import BudgetChart from "../Chart/BudgetChart";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function Home({
  transactions,
  setTransactions,
  setCurrentUser,
  currentUser,
}) {
  const [budgets, setBudgets] = useState(() => {
    return JSON.parse(localStorage.getItem("budgets")) || [];
  });

  useEffect(() => {
    if (!currentUser) {
      setBudgets([]);
      return;
    }
    const storedBudgets =
      JSON.parse(localStorage.getItem(`${currentUser.email}_budgets`)) || [];
    setBudgets(storedBudgets);
  }, [currentUser, transactions]);

  // prepare chart data
  const chartData = useMemo(() => {
    if (budgets.length === 0) return [];
    return budgets.map((b) => ({
      name: b.name,
      value: b.amount,
      color: b.color || "#D9534F",
    }));
  }, [budgets]);

  const totals = useMemo(() => {
    if (!transactions || transactions.length === 0) return {};

    return transactions.reduce((acc, t) => {
      const key = t.category.trim();
      acc[key] = (acc[key] || 0) + Number(t.amount);
      return acc;
    }, {});
  }, [transactions]);
  // ----------Handle Above Sec (LogOut)----------

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setBudgets([]);
    setTransactions([]);
    setCurrentUser(null);
    navigate("/login");
  };

  // ----------Handle Above Sec (Total Spending this Month)----------
  const thisMonth = new Date().getMonth();

  const totalSpend = useMemo(() => {
    return transactions
      .filter((t) => new Date(t.date).getMonth() === thisMonth)
      .reduce((acc, t) => acc + Number(t.amount), 0);
  }, [transactions, thisMonth]);

  // ----------Handle Above Sec (top category)----------
  const { topCategoryName, topCategoryValue } = useMemo(() => {
    let topCategoryName = "";
    let topCategoryValue = 0;
    const categoryTotals = {};

    for (const t of transactions) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;

      if (categoryTotals[t.category] > topCategoryValue) {
        topCategoryValue = categoryTotals[t.category];
        topCategoryName = t.category;
      }
    }
    return { topCategoryName, topCategoryValue };
  }, [transactions]);

  // ----------Handle Above Sec (Number Of Transactions)----------
  const countOfTransactions = useMemo(() => {
    let counter = 0;
    for (const t of transactions) {
      if (Number(t.amount) !== 0) {
        counter++;
      }
    }
    return counter;
  }, [transactions]);

  return (
    <>
      <div className="container">
        <div className="above">
          <h2>Overview</h2>
          <div className="logOut" onClick={handleLogout}>
            <IconButton>
              <LogoutIcon className="logOutLogo" />
            </IconButton>
            <p>Logout</p>
          </div>
        </div>

        <div className="squares">
          <div className="total">
            <h6> Total Spending This Month</h6>
            <p>{totalSpend > 0 ? `${totalSpend} EGP` : "No spending yet"}</p>
          </div>

          <div className="topCat">
            <h6>Top Category</h6>
            <p>
              {topCategoryValue > 0 ? `${topCategoryName}` : "No spending yet"}
            </p>
          </div>
          <div className="numberOf">
            <h6>Number Of Transactions</h6>
            <p>{countOfTransactions}</p>
          </div>
        </div>
        <div className="handleSec">
          {/* -----------left Sec--------- */}
          <div className="leftSecHome">
            <div className="transactionsList">
              <h3>Recent Transactions</h3>
              {transactions && transactions.length > 0 ? (
                [...transactions]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(-5)
                  .reverse()
                  .map((t, index) => (
                    <div key={index} className="transactionItem">
                      <div className="transactionTitle">{t.title}</div>
                      <div className="transactionDate">{t.date}</div>
                      <div className="transactionAmount">
                        {t.amount > 0 ? "+" : ""}
                        {new Intl.NumberFormat("en-EG").format(t.amount)} EGP
                      </div>
                    </div>
                  ))
              ) : (
                <p>No recent transactions</p>
              )}
            </div>
          </div>

          {/* -----------Right Sec--------- */}
          <div className="rightSecHome">
            <h3>Budgets</h3>
            {topCategoryValue > 0 ? (
              <BudgetChart
                chartData={chartData}
                budgets={budgets}
                totals={totals}
                showTotal={false}
                showTitle={false}
                layout="horizontal"
              />
            ) : (
              <p>No Data Provided.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
