import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import collegelogo from "../assets/collegelogo.png";
import { User } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={collegelogo} alt="College Logo" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        <Link to="/dashboard" className="navbar-link">
          Home
        </Link>
        <Link to="/add" className="navbar-link">
          Add
        </Link>
        <Link to="/search" className="navbar-link">
          Search
        </Link>
        <Link to="/saved-itineraries" className="navbar-link">
          View Your Publications
        </Link>
        <Link to="/refresh" className="navbar-link">
          Refresh Your Data
        </Link>
        <div className="user-icon" onClick={toggleUserMenu}>
          <User size={24} />
        </div>
        <div className={`user-dropdown ${isUserMenuOpen ? "show" : ""}`}>
          <Link to="/edit-profile" onClick={toggleUserMenu}>
            Edit Your Profile
          </Link>
          <Link to="/logout" onClick={toggleUserMenu}>
            Logout
          </Link>
        </div>
        <div className="navbar-menu-icon" onClick={toggleMenu}>
          ☰
        </div>
        <div className={`navbar-dropdown ${isMenuOpen ? "show" : ""}`}>
          <Link to="/dashboard" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/add" onClick={toggleMenu}>
            Add
          </Link>
          <Link to="/search" onClick={toggleMenu}>
            Search
          </Link>
          <Link to="/saved-itineraries" onClick={toggleMenu}>
            View Your Publications
          </Link>
          <Link to="/refresh" onClick={toggleMenu}>
            Refresh Your Data
          </Link>
          <Link to="/edit-profile" onClick={toggleMenu}>
            Edit Your Profile
          </Link>
          <Link to="/logout" onClick={toggleMenu}>
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
