import React from 'react';
import { Home, Users, BookOpen, Settings, BookText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ active = 'inventory' }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <BookText size={24} />
        <div>
          <div style={{fontSize:'0.9rem', lineHeight: '1'}}>Clean Bookstore</div>
        </div>
      </div>
      <div className="nav-links">
        <div className="nav-item">
          <Home size={18} /> Home
        </div>
        <Link to="/users" className={`nav-item ${active === 'authors' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
          <Users size={18} /> Authors
        </Link>
        <Link to="/dashboard" className={`nav-item ${active === 'inventory' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
          <BookOpen size={18} /> Inventory
        </Link>
        <div className="nav-item">
          <Settings size={18} /> Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
