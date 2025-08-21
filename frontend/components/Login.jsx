import React, { useState } from 'react';
import axios from 'axios';
import '../src/App.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://mern-musebook.onrender.com/login', loginData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.dispatchEvent(new Event("storage")); // Trigger storage event
        alert('Login successful! Redirecting...');
        navigate("/");
      } else {
        alert("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert('Login failed! Check console for details.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://mern-musebook.onrender.com/forgot-password', { email: forgotEmail });
      setOtpSent(true);
      setResetStep(2);
      alert('OTP sent to your email!');
    } catch (error) {
      alert('Failed to send OTP. Check email and try again.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://mern-musebook.onrender.com/reset-password', {
        email: forgotEmail,
        otp,
        newPassword
      });
      alert('Password reset successful! Please login.');
      setShowForgot(false);
      setOtpSent(false);
      setResetStep(1);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
    } catch (error) {
      alert('Failed to reset password. Check OTP and try again.');
    }
  };

  return (
    <div className="body-container">
      <div className="main-container">
      <h1><img src="\images\logo.png" alt="Logo" /></h1>
      <h3>Enter your login credentials</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Email:</label>
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          required
        />
        
        <label htmlFor="password">Password:</label>
        <input
         type="password"
         placeholder="Enter password"
         name="password"
         value={loginData.password}
         onChange={handleChange}
          required
        />
        
        {/* <label>
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={handleRememberChange}
          /> 
          Remember Me
        </label> */}
        
        <button
          className="bht"
          type="submit"
        >
          Login
        </button>
      </form>
      <p>
        {/* Remove href, use modal logic only */}
        <a onClick={() => setShowForgot(true)} style={{cursor: 'pointer'}}>Forgot Password?</a>
      </p>
      <p>Not registered? <a  onClick={() => navigate("/signup")}>Create an account</a></p>
      <p>Admin? <a href="admin.php">Login Here</a></p>
   
     
    </div>
    </div>
    {/* Forgot Password Modal */}
    {showForgot && (
        <div className="modal">
          <div className="modal-content">
            <button style={{float: 'right'}} onClick={() => setShowForgot(false)}>X</button>
            <h3>Forgot Password</h3>
            {resetStep === 1 && (
              <form onSubmit={handleForgotSubmit}>
                <label>Email:</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                />
                <button type="submit">Send OTP</button>
              </form>
            )}
            {resetStep === 2 && (
              <form onSubmit={handleResetSubmit}>
                <label>OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <button type="submit">Reset Password</button>
              </form>
            )}
          </div>
        </div>
      )}
  );
}
export default Login;