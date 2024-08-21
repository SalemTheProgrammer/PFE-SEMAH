// src/index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Header from './components/Header'; 
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import AboutUs from './components/AboutUs';
import Products from './components/Products';
import BookNow from './components/BookNow';
import Appointments from './components/Appointments';
import api from './api'; // Ensure api is configured to handle requests

const Root = () => {
  const [user, setUser] = useState(null);

 

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<App user={user} setUser={setUser} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/book-now" element={<BookNow user={user} />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
