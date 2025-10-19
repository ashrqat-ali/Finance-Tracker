import React, { useState } from "react";
import "./modal.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "react-select";

export default function ModalComp({ show, onClose, onAdd }) {
  const [selectOption, setSelect] = useState(null);
  const [value, setValue] = useState(0);
  const [transactionName, setTransactionName] = useState("");
  const [dateSetting, setDateSetting] = useState(null);

  const options = [
    { value: "Food", label: "Food" },
    { value: "Shopping", label: "Shopping" },
    { value: "Education", label: "Education" },
    { value: "LifeStyle", label: "LifeStyle" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transactionName || !dateSetting || !selectOption || !value) {
      alert("Please fill all fields!");
      return;
    }

    const newTransaction = {
      title: transactionName,
      date: dateSetting.format("YYYY-MM-DD"),
      category: selectOption.value,
      amount: Number(value),
    };

    onAdd(newTransaction);
    onClose();

    // reset
    setTransactionName("");
    setDateSetting(null);
    setSelect(null);
    setValue(0);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="bodyRec">
            <div className="search">
              <span className="tra">Transaction Name</span>
              <TextField
                // label="Transaction Name"
                variant="outlined"
                className="search"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "var(--btn-bg)",
                  },
                }}
              />
            </div>

            <div className="date">
              {/* <span>Transaction Date</span> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Transaction Date"
                    value={dateSetting}
                    onChange={(newValue) => setDateSetting(newValue)}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        fullWidth: true,
                        sx: {
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "var(--text-secondary)",
                          },

                          "& .MuiInput-underline:after": {
                            borderBottomColor: "var(--btn-bg) !important",
                          },
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="category">
              <span className="cat">Category</span>
              <Select
                classNamePrefix="react-select"
                value={selectOption}
                onChange={setSelect}
                options={options}
                isClearable
                isSearchable
              />
            </div>

            <div className="amount">
              <span>Amount</span>
              <TextField
                type="number"
                // label="Amount"
                placeholder="Type a number…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "0.8rem",
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "rgba(0,0,0,0.08)",
                        },
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#999",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--btn-bg)",
                      borderWidth: "0px",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "var(--btn-bg)",
                  },
                  "& input": {
                    fontSize: "0.9rem",
                    padding: "10px",
                  },
                }}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button className="subBtn" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
