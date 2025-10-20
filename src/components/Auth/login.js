import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.scss";
import loginImg from "../../assets/tracker.jpg";

export const Login = ({ setCurrentUser, setTransactions }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const validationErrors = validateInput(formData.email, formData.password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const savedData = JSON.parse(localStorage.getItem("userData")) || [];

    if (!Array.isArray(savedData) || savedData.length === 0) {
      setErrors({ form: "No accounts found. Please sign up first." });
      return;
    }

    const existingUser = savedData.find(
      (user) => user.email === formData.email
    );

    if (!existingUser) {
      setErrors({ form: "This email is not registered." });
    } else if (existingUser.password !== formData.password) {
      setErrors({ form: "Incorrect password. Try again." });
    } else {
      console.log("Login successful");

      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      setCurrentUser(existingUser);

      const savedTransactions =
        JSON.parse(
          localStorage.getItem(`${existingUser.email}_transactions`)
        ) || [];

      if (typeof setTransactions === "function") {
        setTransactions(savedTransactions);
      }

      navigate("/dashboard/home");
    }
  };

  function validateInput(email, password) {
    const errors = {};
    if (!email || !password) {
      errors.form = "Please fill in all fields";
    }
    return errors;
  }

  return (
    <div className="auth-container">
      <div className="leftSide">
        <img src={loginImg} className="fullImg" alt="loginImg" />
      </div>

      <div className="rightSide">
        <div className="formText">
          <h2>Welcome Back</h2>
          <p>Login to continue managing your finances.</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="errorMsg">
            {errors.form && <p className="error">{errors.form}</p>}
          </div>
          <button type="submit">Login</button>
        </form>

        <p className="ask">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};
