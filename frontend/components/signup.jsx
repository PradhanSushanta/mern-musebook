import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../src/App.css';

const validateName = (name) => {
  if (!name.trim()) return "Name is required.";
  if (!/^[a-zA-Z\s]{2,30}$/.test(name)) return "Name must be 2-30 letters.";
  return "";
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@(gmail|yahoo|outlook|hotmail|live|aol|icloud|protonmail|zoho|gmx|mail|yandex|rediffmail|fastmail|msn|comcast|verizon|att|bt|sbcglobal|rocketmail|mailinator)\.(com|net|org|in|edu|gov|co|io|me|info|biz|us|uk|ca|de|fr|au|jp|cn|ru|ch|it|nl|se|no|es|mil)$/i;
  if (!emailRegex.test(email)) return "Invalid email provider or domain extension.";

  // Username length check for all providers
  const match = email.match(/^([^\s@]+)@([a-zA-Z0-9\-]+)\.[a-zA-Z]{2,}$/i);
  if (match) {
    const username = match[1];
    if (username.length < 5 || username.length > 30) {
      return "Email username must be 5-30 characters.";
    }
  }
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character.";
  return "";
};

const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return "Confirm password is required.";
  if (password !== confirm) return "Passwords do not match.";
  return "";
};

const Signup = () => {
  const [formDta, setformDta] = useState({
    fullName: '',
    fullemail: '',
    fullpassword: '',
    fullconfirmpassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const onhandleChange = (e) => {
    const { name, value } = e.target;
    setformDta({ ...formDta, [name]: value });

    // Validate on change
    let newErrors = { ...errors };
    if (name === 'fullName') newErrors.fullName = validateName(value);
    if (name === 'fullemail') newErrors.fullemail = validateEmail(value);
    if (name === 'fullpassword') newErrors.fullpassword = validatePassword(value);
    if (name === 'fullconfirmpassword') newErrors.fullconfirmpassword = validateConfirmPassword(formDta.fullpassword, value);
    setErrors(newErrors);
  };

  const submithandler = async (e) => {
    e.preventDefault();
    const { fullName, fullemail, fullpassword, fullconfirmpassword } = formDta;

    // Validate all fields before submit
    const newErrors = {
      fullName: validateName(fullName),
      fullemail: validateEmail(fullemail),
      fullpassword: validatePassword(fullpassword),
      fullconfirmpassword: validateConfirmPassword(fullpassword, fullconfirmpassword)
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    try {
      const response = await axios.post("https://mern-musebook.onrender.com/signup", {
        fullName,
        fullemail,
        fullpassword
      });
      alert("Registration successful! Redirecting to Login...");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Registration failed! Please try again.");
    }
  };

  return (
    <div className="body-container">
      <div className="main-container">
        <h1><img src="\images\logo.png" alt="Logo" /></h1>
        <h3>Enter your sign-up credentials</h3>
        <form onSubmit={submithandler}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder='Full Name'
            name='fullName'
            value={formDta.fullName}
            onChange={onhandleChange}
            required
          />
          {errors.fullName && <div className="error">{errors.fullName}</div>}

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder='Email'
            name='fullemail'
            value={formDta.fullemail}
            onChange={onhandleChange}
            required
          />
          {errors.fullemail && <div className="error">{errors.fullemail}</div>}

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder='Password'
            name='fullpassword'
            value={formDta.fullpassword}
            onChange={onhandleChange}
            required
          />
          {errors.fullpassword && <div className="error">{errors.fullpassword}</div>}

          <label htmlFor="confirm-password">Confirm-Password:</label>
          <input
            type="password"
            placeholder='Confirm Password'
            name='fullconfirmpassword'
            value={formDta.fullconfirmpassword}
            onChange={onhandleChange}
            required
          />
          {errors.fullconfirmpassword && <div className="error">{errors.fullconfirmpassword}</div>}

          <button className="bht" type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a onClick={() => navigate("/login")}>Login here</a></p>
      </div>
    </div>
  );
}

export default Signup;