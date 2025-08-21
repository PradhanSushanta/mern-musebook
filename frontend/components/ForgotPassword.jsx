import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mern-musebook.onrender.com/forgot-password/send-otp", { email });
      if (res.data.success) {
        setServerOtp(res.data.otp); // For demo, backend should not send OTP to frontend!
        setStep(2);
        alert("OTP sent to your email.");
      } else {
        alert(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      alert("Error sending OTP.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // For demo, compare with serverOtp. In real, send to backend for verification.
    if (otp === serverOtp) {
      setStep(3);
    } else {
      alert("Invalid OTP.");
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post("https://mern-musebook.onrender.com/forgot-password/reset", {
        email,
        newPassword,
        otp
      });
      if (res.data.success) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        alert(res.data.message || "Failed to reset password.");
      }
    } catch (err) {
      alert("Error resetting password.");
    }
  };

  return (
    <div className="body-container">
      <div className="main-container">
        <h2>Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <button type="submit" className="bht">Send OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label>Enter OTP sent to your email:</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              placeholder="Enter OTP"
            />
            <button type="submit" className="bht">Verify OTP</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            <button type="submit" className="bht">Reset Password</button>
          </form>
        )}
        <p>
          <a style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate("/login")}>
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
