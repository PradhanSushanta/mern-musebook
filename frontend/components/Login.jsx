import React, { useState } from 'react';
import axios from 'axios';
import '../src/App.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
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
  return (
    <div className="body-container">
      <div className="main-container">
      <h1><img src="\images\logo.png" alt="Logo" /></h1>
      <h3>Enter your login credentials</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
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
      <p><a href="forgot_password.php">Forgot Password?</a></p>
        <p>Not registered? <a  onClick={() => navigate("/signup")}>Create an account</a></p>
        <p>Admin? <a href="admin.php">Login Here</a></p>
   
     
    </div>
    </div>
  );
}
export default Login;