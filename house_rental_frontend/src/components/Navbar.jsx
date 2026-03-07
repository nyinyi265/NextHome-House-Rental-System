import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">NextHome</div>
      <ul className="navbar-links">
        <li>
          <a href="#">Explore</a>
        </li>
        <li>
          <a href="#">Become a Host</a>
        </li>
        <li>
          <a href="#">Messages</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
      </ul>
      <button className="navbar-button">Host Dashboard</button>
    </nav>
  );
}
