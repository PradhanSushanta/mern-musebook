import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../src/App.css';

const Signup = () => {
  const [formDta, setformDta] = useState({
    fullName: '',
    fullemail: '',
    fullpassword: '',
    fullconfirmpassword: ''
  });

  const navigate = useNavigate(); 

  const onhandleChange = (e) => {
    const { name, value } = e.target;
    setformDta({ ...formDta, [name]: value });
  };

  const submithandler = async (e) => {
    e.preventDefault();
    const { fullName, fullemail, fullpassword, fullconfirmpassword } = formDta;

    if (!fullName || !fullemail || !fullpassword || !fullconfirmpassword) {
      alert("All fields are required!");
      return;
    }

    if (fullpassword !== fullconfirmpassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", formDta);
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

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder='Email'
          name='fullemail'
          value={formDta.fullemail}
          onChange={onhandleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder='Password'
          name='fullpassword'
          value={formDta.fullpassword}
          onChange={onhandleChange}
          required
        />
        <label htmlFor="confirm-password">Confirm-Password:</label>
        <input
           type="password"
           placeholder='Confirm Password'
           name='fullconfirmpassword'
           value={formDta.fullconfirmpassword}
           onChange={onhandleChange}
          required
        />

        <button className="bht" type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a onClick={() => navigate("/login")}>Login here</a></p>
      
    </div>
    </div>
  );
}


export default Signup;