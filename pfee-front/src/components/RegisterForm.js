import React, { useState } from "react";
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Registration
        </h1>
        <div className="flex justify-center mb-4">
          <button
            type="button"
            className={`${
              formData.userType === "customers"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-l-lg focus:outline-none`}
            onClick={() => handleUserTypeChange("customers")}
          >
            Customers
          </button>
          <button
            type="button"
            className={`${
              formData.userType === "hairdresser"
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-r-lg focus:outline-none`}
            onClick={() => handleUserTypeChange("hairdresser")}
          >
            Hairdresser
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formData.userType === "customers" ? (
            <>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex space-x-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex space-x-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <input
                type="text"
                name="profileDescription"
                placeholder="Profile Description"
                required
                value={formData.profileDescription}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
