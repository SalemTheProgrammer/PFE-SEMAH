// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="header-center">
        <ul className="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/products">Products</Link></li>
          {user && user.userType === 'customer' && (
            <li><Link to="/book-now">Book Now</Link></li>
          )}
          {user && user.userType === 'hairdresser' && (
            <li><Link to="/appointments">Appointments</Link></li>
          )}
        </ul>
      </div>
      <div className="header-right">
        {user ? (
          <button className="btn2" onClick={handleLogout}>Disconnect</button>
        ) : (
          <>
            <Link to="/register">
              <button className="btn1">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="btn2">Log In</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
