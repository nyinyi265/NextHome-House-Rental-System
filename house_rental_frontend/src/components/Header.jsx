import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="hr-header">
      <div className="container">
        <h1 className="logo">HouseRental</h1>
        <nav>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
