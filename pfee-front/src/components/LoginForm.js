import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Ensure this is configured properly

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
        localStorage.setItem("loginResponse", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        console.log("User set in LoginForm:", response.data.user);
        if (response.data.user.isAdmin) {
          localStorage.setItem("role", "admin");
        } else {
          localStorage.setItem("role", "user");
        }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
