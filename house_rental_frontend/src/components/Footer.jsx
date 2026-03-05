import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="hr-footer" id="contact">
      <div className="container">
        <p>© {new Date().getFullYear()} House Rental System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;