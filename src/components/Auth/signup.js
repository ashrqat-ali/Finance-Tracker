import { useNavigate } from "react-router-dom";
import "./auth.scss";
import { useState } from "react";
import signImg from "../../assets/SLImg.jpeg";

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    const validationErrors = validateInput(
      formData.name,
      formData.email,
      formData.password
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      let existingUsers = JSON.parse(localStorage.getItem("userData")) || [];

      if (!Array.isArray(existingUsers)) {
        existingUsers = [existingUsers];
      }

      const userExists = existingUsers.some(
        (user) => user.email === formData.email
      );

      if (userExists) {
        setMessage("This email is already registered!");
        setMessageType("error");
      } else {
        existingUsers.push(formData);
        localStorage.setItem("userData", JSON.stringify(existingUsers));
        localStorage.setItem("currentUser", JSON.stringify(formData));

        setMessage("Signup successful!");
        setMessageType("success");
      }
      if (!userExists) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else if (userExists) {
        setTimeout(() => {}, 2000);

        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    }
  };

  // --------Validations----------
  function validateInput(name, email, password) {
    const errors = {};
    if (!name) {
      errors.name = "Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  }

  return (
    <>
      <div className="auth-container">
        <div className="leftSide">
          <img src={signImg} className="fullImg" alt="signImg" />
        </div>

        <div className="rightSide">
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <div className="errorMsg">
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="errorMsg">
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <button type="submit">Sign Up</button>
          </form>
          <p className="ask">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>

      <footer>
        {message && (
          <div className={`messageCard ${messageType}`}>{message}</div>
        )}
      </footer>
    </>
  );
};
