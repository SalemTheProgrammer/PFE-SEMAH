// src/components/LoginForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Ensure this is configured properly
import "./styles.css";

const LoginForm = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      console.log("Login response:", response);
      if (response.status === 200) {
        alert("Login successful");
        // Store the entire response in localStorage
        localStorage.setItem("loginResponse", JSON.stringify(response.data));
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        // Set user state
        setUser(response.data.user);
        console.log("User set in LoginForm:", response.data.user);
        // Redirect to home
        navigate("/");
      } else {
        setError(response.data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to submit form", err);
      setError("Failed to submit form");
    }
  };
  
  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;