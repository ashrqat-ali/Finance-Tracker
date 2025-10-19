import { Link, Outlet } from "react-router-dom";
import "./dash.scss";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FaHome, FaWallet, FaListAlt } from "react-icons/fa";

export default function DashBoard() {
  const [active, setActive] = useState(null);
  // --------handle User--------

  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const userName = storedUser?.name || "Guest";

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Finance Tracker</h2>
        <ul className="menu">
          <li>
            <Link to="home" onClick={() => setActive("home")}>
              <FaHome className={`icon ${active === "home" ? "active" : ""}`} />{" "}
              <span className="home">Home</span>
            </Link>
          </li>

          <li>
            <Link to="transactions" onClick={() => setActive("list")}>
              <FaListAlt
                className={`icon ${active === "list" ? "active" : ""}`}
              />{" "}
              <span className="trans">Transactions</span>
            </Link>
          </li>

          <li>
            <Link to="budgets" onClick={() => setActive("budget")}>
              <FaWallet
                className={`icon ${active === "budget" ? "active" : ""}`}
              />{" "}
              <span className="budget">Budgets</span>
            </Link>
          </li>
        </ul>
        <footer className="dashboard-footer">
          <AccountCircleIcon className="user-icon" />
          <span className="userName">{userName}</span>
        </footer>
      </div>

      {/* Main */}
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
