import React, { useEffect, useState, useMemo } from "react";
import "./budgets.scss";
import BudgetChart from "../Chart/BudgetChart";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import ProgressBar from "@ramonak/react-progress-bar";
import { CirclePicker } from "react-color";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function Budgets({ transactions }) {
  const [show, setShow] = useState(false);
  const [selectOption, setSelect] = useState(null);
  const [value, setValue] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  // for Dots Icone
  const handleClick = (id) => (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpenId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpenId(null);
  };

  const optionsDots = ["Edit", "Delete"];

  // -----------------------------------
  const options = [
    { value: "Food", label: "Food" },
    { value: "Shopping", label: "Shopping" },
    { value: "Education", label: "Education" },
    { value: "LifeStyle", label: "LifeStyle" },
  ];

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userKey = currentUser
    ? `${currentUser.email}_budgets`
    : "guest_budgets";

  const [budgets, setBudgets] = useState(() => {
    return JSON.parse(localStorage.getItem(userKey)) || [];
  });

  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(budgets));
  }, [budgets, userKey]);

  // handle Delete

  const handleDelete = (id) => {
    setBudgets((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem("budgets", JSON.stringify(updated));
      return updated;
    });
  };
  //handle Edit
  const [editItem, setEditItem] = useState(null);

  // ----------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectOption || value === "") {
      alert("Please fill all fields!");
      return;
    }

    if (editItem) {
      const updatedBudgets = budgets.map((b) =>
        b.id === editItem.id
          ? {
              ...b,
              name: selectOption.label,
              amount: Number(value),
              color: selectedColor,
            }
          : b
      );

      setBudgets(updatedBudgets);
      localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
      setEditItem(null);
    } else {
      const newBudget = {
        name: selectOption.label,
        amount: Number(value),
        color: selectedColor,
        id: Date.now(),
      };

      const updated = [...budgets, newBudget];
      setBudgets(updated);
      localStorage.setItem("budgets", JSON.stringify(updated));
    }

    setSelect(null);
    setValue("");
    setShow(false);
  };

  const totals = useMemo(() => {
    if (!transactions || transactions.length === 0) return {};

    return transactions.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {});
  }, [transactions]);

  // ------------Handle LeftSec---------------

  const chartData = useMemo(() => {
    if (budgets.length === 0) return [];

    return budgets.map((b) => ({
      name: b.name,
      value: b.amount,
      color: b.color || "#D9534F",
    }));
  }, [budgets]);

  return (
    <>
      <div className="container">
        <div className="above">
          <h2>Budgets</h2>
          <button className="aboveBtnBudget" onClick={() => setShow(true)}>
            +Add New Budget
          </button>
        </div>
        <div className="reportSec">
          {/* ------------Handle LeftSec--------------- */}
          {budgets.length > 0 && (
            <div className="leftSec">
              <BudgetChart
                chartData={chartData}
                budgets={budgets}
                totals={totals}
              />
            </div>
          )}

          {/* ------------Handle RightSec--------------- */}
          <div className="budgetList right">
            {budgets.length === 0 ? (
              <p>No budget yet.</p>
            ) : (
              budgets.map((item) => (
                <div key={item.id} className="budget-card">
                  <h4>{item.name}</h4>
                  <div className="forDots">
                    <IconButton
                      aria-label="more"
                      aria-haspopup="true"
                      onClick={handleClick(item.id)}
                    >
                      <MoreHorizIcon />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={menuOpenId === item.id}
                      onClose={handleClose}
                    >
                      {optionsDots.map((option, index) => (
                        <MenuItem
                          key={option}
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "1rem" },
                            borderBottom:
                              index !== optionsDots.length - 1
                                ? "1px solid var(--border-Bottom)"
                                : "none",
                          }}
                          onClick={() => {
                            if (option === "Delete") {
                              handleDelete(item.id);
                            } else if (option === "Edit") {
                              setEditItem(item);
                              setSelect({ value: item.name, label: item.name });
                              setValue(item.amount);
                              setSelectedColor(item.color || "#4caf50");
                              setShow(true);
                            }
                            handleClose();
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>

                  <p>
                    {" "}
                    Maximum of{" "}
                    {new Intl.NumberFormat("en-EG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(item.amount)}{" "}
                    EGP
                  </p>
                  <div className="calcBar">
                    <ProgressBar
                      completed={totals[item.name] || 0}
                      isLabelVisible={false}
                      bgColor={item.color}
                    />
                  </div>
                  <div className="budgetCalc">
                    <div
                      className="spend"
                      style={{ "--border-color": item.color }}
                    >
                      <p id="spendW">Spend</p>

                      <p className="price">
                        {new Intl.NumberFormat("en-EG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(totals[item.name] || 0)}{" "}
                        EGP
                      </p>
                    </div>

                    <div className="free">
                      <p id="freeW">Free</p>
                      <p className="price">
                        {new Intl.NumberFormat("en-EG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.amount - totals[item.name] || 0)}{" "}
                        EGP
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ---------------------Modal Start--------------------- */}
        <Modal show={show} onHide={() => setShow(false)}>
          <form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <h3>Add New Budget</h3>
            </Modal.Header>

            <Modal.Body>
              <p>
                Choose a category to set a spending budget. These categories can
                help you monitor spending.
              </p>

              <div className="category">
                <span className="cat">Category</span>
                <Select
                  classNamePrefix="react-select"
                  value={selectOption}
                  onChange={(option) => setSelect(option)}
                  options={options}
                  isClearable
                  isSearchable
                />
              </div>

              <div className="amount">
                <span id="maxSpend">Maximum Spend</span>
                <TextField
                  type="number"
                  placeholder="Type a number…"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderWidth: "0",
                        borderColor: "var(--border-color)",
                      },
                    },
                  }}
                />
              </div>

              <div className="theme">
                <span id="themSpan">Theme</span>
                <CirclePicker
                  color={selectedColor}
                  onChangeComplete={(c) => setSelectedColor(c.hex)}
                  circleSize={14}
                  circleSpacing={8}
                  width="200px"
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="subBtn" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
}
