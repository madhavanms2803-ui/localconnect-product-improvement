import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquareText, CircleAlert } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <NavLink to="/" end className="nav-logo">LocalConnect</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}`}>
            <MessageSquareText size={18} />
            <span>Neighborhood Feed</span>
          </NavLink>
          <NavLink to="/issues" className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}`}>
            <CircleAlert size={18} />
            <span>Local Issues</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
