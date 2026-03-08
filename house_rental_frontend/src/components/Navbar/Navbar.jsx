import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">NextHome</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/host">Become a Host</Link>
        </li>
      </ul>
      {user ? (
        <>
          <span className="navbar-user">{user.email}</span>
          <button className="navbar-button" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-button">Login</Link>
          <Link to="/register" className="navbar-button">Register</Link>
        </>
      )}
    </nav>
  );
}
