import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('loginResponse'));
    if (savedUser && savedUser.user) {
      setUser(savedUser.user);
      const role = localStorage.getItem('role');
      setIsAdmin(role === 'admin');
    }
  }, [setUser]);

  // Add this new useEffect to update isAdmin when user changes
  useEffect(() => {
    if (user) {
      const role = localStorage.getItem('role');
      setIsAdmin(role === 'admin');
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loginResponse');
    setIsAdmin(false);
    navigate('/');
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
          {isAdmin && (
            <li><Link to="/dashboard">Dashboard</Link></li>
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