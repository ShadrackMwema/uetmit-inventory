import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState); // Toggle the menu state
    };

    const closeMenu = () => {
        setIsMenuOpen(false); // Close the menu when a link is clicked
    };

    return (
        <header className="header">
            <h1 className="header-title">UET MIT INVENTORY</h1>
            
            <button
                className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
            >
                <div className="mobile-menu-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            
            <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={closeMenu}>Dashboard</Link></li>
                    <li><Link to="/instruments" onClick={closeMenu}>Instruments</Link></li>
                    <li><Link to="/add" onClick={closeMenu}>Add Instrument</Link></li>
                    <li><Link to="/new-checklist" onClick={closeMenu}>New Checklist</Link></li>
                    <li><Link to="/checklists" onClick={closeMenu}>View Checklists</Link></li>
                    <li><Link to="/history" onClick={closeMenu}>History</Link></li>
                    <li><Link to="/settings" onClick={closeMenu}>Settings</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;