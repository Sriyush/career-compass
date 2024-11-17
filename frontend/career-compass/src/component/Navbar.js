import React from 'react';
// import './Navbar.css'; // Create a separate CSS file for the Navbar styling if needed
import myImage from "../myImage.jpg";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={myImage} alt="Webapp's logo" className="cclogo" />
        <h2 className="navbar-title">CareerCompass: Your Guide to Career Success</h2>
      </div>
      <div className="navbar-right">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/joblisting" className="navbar-link">Job Listing</Link>
      </div>
    </nav>
  );
};

export default Navbar;
