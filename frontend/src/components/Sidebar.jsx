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
        <Link to="/home" className={`nav-item ${active === 'home' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
          <Home size={18} /> Ana Sayfa
        </Link>
        <Link to="/users" className={`nav-item ${active === 'authors' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
          <Users size={18} /> Kullanıcılar
        </Link>
        <Link to="/dashboard" className={`nav-item ${active === 'inventory' ? 'active' : ''}`} style={{textDecoration: 'none'}}>
          <BookOpen size={18} /> Yönetim
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
