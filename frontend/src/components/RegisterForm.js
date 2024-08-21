// src/components/RegisterForm.js
import React, { useState } from "react";
import api from "../api";
import "./styles.css"; // Ensure this CSS file exists
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    userType: "customers", // Default user type
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    hairdresserName: "",
    profileDescription: "", // Updated field name
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (userType) => {
    setFormData({
      ...formData,
      userType,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const url =
      formData.userType === "customers" ? "/register" : "/register-hairdresser";

    const dataToSend =
      formData.userType === "customers"
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }
        : {
            hairdresserName: formData.hairdresserName,
            hairdresserEmail: formData.email,
            hairdresserPassword: formData.password,
            hairdresserConfirmPassword: formData.confirmPassword,
            profileDescription: formData.profileDescription, // Updated field name
          };

    try {
      const response = await axios.post(
        "http://localhost:3000" + url,
        dataToSend
      );
      console.log("Response:", response, url);
      if (response.status === 201) {
        alert("Registration successful");
        setFormData({
          userType: "customers",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          hairdresserName: "",
          profileDescription: "", // Updated field name
        });
        setError("");
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
      <h1>Registration</h1>
      <div className="button-group">
        <button
          type="button"
          className={formData.userType === "customers" ? "active" : ""}
          onClick={() => handleUserTypeChange("customers")}
        >
          Customers
        </button>
        <button
          type="button"
          className={formData.userType === "hairdresser" ? "active" : ""}
          onClick={() => handleUserTypeChange("hairdresser")}
        >
          Hairdresser
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {formData.userType === "customers" ? (
          <>
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              name="hairdresserName"
              placeholder="Hairdresser Name"
              required
              value={formData.hairdresserName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="profileDescription"
              placeholder="Profile Description"
              required
              value={formData.profileDescription}
              onChange={handleChange}
            />
          </>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;