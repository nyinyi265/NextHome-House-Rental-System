import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">NextHome</div>
      <ul className="navbar-links">
        <li>
          <Link to="/explore">Explore</Link>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Become a Host</a>
        </li>
      </ul>
      <button className="navbar-button">Host Dashboard</button>
    </nav>
  );
}
