import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [method, setMethod] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !method) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      // Call your backend API
      const response = await fetch("https://mern-musebook.onrender.com/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, method }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        if (method === "otp") {
          navigate("/verify-otp");
        } else if (method === "old_password") {
          navigate("/verify-old-password");
        }
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="password-reset-container">
      <div className="logo-container">
        <img src="/favicon.svg" alt="Company Logo" className="logo" />
      </div>
      <h2>Reset Your Password</h2>

      {message && <div className="message error">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="method-options">
          <h4>Choose verification method:</h4>

          <div className="radio-option">
            <input
              type="radio"
              id="otp-method"
              name="method"
              value="otp"
              checked={method === "otp"}
              onChange={(e) => setMethod(e.target.value)}
              required
            />
            <label htmlFor="otp-method">Send OTP to my email</label>
          </div>

          <div className="radio-option">
            <input
              type="radio"
              id="password-method"
              name="method"
              value="old_password"
              checked={method === "old_password"}
              onChange={(e) => setMethod(e.target.value)}
              required
            />
            <label htmlFor="password-method">Verify with my old password</label>
          </div>
        </div>

        <button type="submit" className="btn">
          Continue
        </button>
      </form>

      <div className="back-to-login">
        Remember your password? <a href="/login">Sign in</a>
      </div>

      {/* Inline Styles moved here */}
      <style>{`
        :root {
          --primary-color:rgb(16, 67, 255);
          --dark-color: #343a40;
          --error-color: #d63031;
        }
        body {
          font-family: 'Poppins', sans-serif;
        }
        .password-reset-container {
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          margin: 40px auto;
          padding: 40px;
          text-align: center;
        }
        .logo {
          max-width: 129px;
          height: auto;
        }
        h2 {
          color: var(--dark-color);
          margin-bottom: 30px;
          font-weight: 600;
        }
        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }
        input[type="text"] {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
        }
        input[type="text"]:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 60, 255, 0.2);
        }
        .method-options {
          margin: 25px 0;
          text-align: left;
        }
        .radio-option {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .radio-option input {
          margin-right: 10px;
        }
        .btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }
        .btn:hover {
          background-color: rgb(53, 33, 228);
        }
        .message {
          margin-top: 20px;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
        }
        .error {
          background-color: rgba(214, 48, 49, 0.1);
          color: var(--error-color);
          border: 1px solid rgba(214, 48, 49, 0.3);
        }
        .back-to-login {
          margin-top: 20px;
          color: var(--dark-color);
          font-size: 14px;
        }
        .back-to-login a {
          color: var(--primary-color);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
