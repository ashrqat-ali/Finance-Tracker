import React, { useState, useEffect } from "react";
import ModalComp from "../Modal/modal";
import { TextField, Select, MenuItem, FormControl } from "@mui/material";
import "./transactions.scss";

export default function Transactions({ transactions, setTransactions }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userKey = currentUser
    ? `${currentUser.email}_transactions`
    : "guest_transactions";

  // ---------------- filter + search + sort ----------------
  const displayed = [...transactions]
    .filter((t) => {
      if (filter !== "All" && t.category !== filter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Latest") return new Date(b.date) - new Date(a.date);
      if (sort === "Oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "A-Z") return a.title.localeCompare(b.title);
      if (sort === "Z-A") return b.title.localeCompare(a.title);
      return 0;
    });

  // ---------------- pagination ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = displayed.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(displayed.length / itemsPerPage);

  // ---------------- save to localStorage on change ----------------
  React.useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(transactions));
  }, [transactions, userKey]);

  // ---------------- handle add transaction ----------------
  const handleAddTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    setShowModal(false);
  };

  return (
    <div className="container">
      <div className="above">
        <h2>Transactions</h2>
        <button className="aboveBtn" onClick={() => setShowModal(true)}>
          +Add New Transaction
        </button>
      </div>

      <div className="bottom">
        <div className="bar">
          <TextField
            label="Search transaction"
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            className="search"
            sx={{
              "& .MuiInputLabel-root.Mui-focused": {
                color: "var(--text-secondary)",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "var(--text-secondary)",
              },
            }}
          />

          <FormControl size="small" className="filter-control">
            <div className="sort-wrapper">
              <span className="sort-label">Sort by</span>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "0.8rem",
                      },
                    },
                  },
                }}
              >
                <MenuItem value="Latest">Latest</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
                <MenuItem value="A-Z">A to Z</MenuItem>
                <MenuItem value="Z-A">Z to A</MenuItem>
              </Select>
            </div>
          </FormControl>

          <FormControl size="small" className="filter-control">
            <div className="filter-wrapper">
              <span className="filter-label">Filter</span>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "0.8rem",
                      },
                    },
                  },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="LifeStyle">LifeStyle</MenuItem>
              </Select>
            </div>
          </FormControl>
        </div>

        {/* Transactions Table */}
        <table className="tableItems">
          <thead>
            <tr>
              <th>Recipient / Sender</th>
              <th>Category</th>
              <th>Transaction Date</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No results.
                </td>
              </tr>
            ) : (
              currentItems.map((t, index) => (
                <tr key={index}>
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  <td>{t.date}</td>
                  <td id="amountTd">
                    +{new Intl.NumberFormat("en-EG").format(t.amount)} EGP
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex gap-4 mt-4 pagination">
          <button
            className="preBtn flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <span className="rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.85344 3.14647L10.8534 8.14647C10.8999 8.1929 10.9368 8.24805 10.962 8.30875C10.9871 8.36944 11.0001 8.43451 11.0001 8.50022C11.0001 8.56592 10.9871 8.63099 10.962 8.69169C10.9368 8.75238 10.8999 8.80753 10.8534 8.85397L5.85345 13.854C5.78352 13.924 5.69439 13.9717 5.59735 13.991C5.50031 14.0103 5.39971 14.0004 5.3083 13.9625C5.21689 13.9247 5.13877 13.8605 5.08383 13.7782C5.0289 13.6959 4.99962 13.5992 4.99969 13.5002L4.99969 3.50022C4.99962 3.40127 5.0289 3.30452 5.08383 3.22222C5.13877 3.13993 5.21689 3.07578 5.3083 3.0379C5.39971 3.00003 5.50031 2.99013 5.59735 3.00945C5.69439 3.02878 5.78352 3.07646 5.85344 3.14647Z" />
              </svg>
            </span>
            <span className="hidden md:block">Prev</span>
          </button>

          <button
            className="nextBtn flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <span className="hidden md:block">Next</span>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.85344 3.14647L10.8534 8.14647C10.8999 8.1929 10.9368 8.24805 10.962 8.30875C10.9871 8.36944 11.0001 8.43451 11.0001 8.50022C11.0001 8.56592 10.9871 8.63099 10.962 8.69169C10.9368 8.75238 10.8999 8.80753 10.8534 8.85397L5.85345 13.854C5.78352 13.924 5.69439 13.9717 5.59735 13.991C5.50031 14.0103 5.39971 14.0004 5.3083 13.9625C5.21689 13.9247 5.13877 13.8605 5.08383 13.7782C5.0289 13.6959 4.99962 13.5992 4.99969 13.5002L4.99969 3.50022C4.99962 3.40127 5.0289 3.30452 5.08383 3.22222C5.13877 3.13993 5.21689 3.07578 5.3083 3.0379C5.39971 3.00003 5.50031 2.99013 5.59735 3.00945C5.69439 3.02878 5.78352 3.07646 5.85344 3.14647Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* -------------Modal----------------- */}

      {/* <ModalComp/> */}

      {showModal && (
        <ModalComp
          show={showModal}
          onAdd={handleAddTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
