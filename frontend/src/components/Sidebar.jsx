import React from 'react';
import { Home, Users, BookOpen, Settings, BookText } from 'lucide-react';

const Sidebar = () => {
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
        <div className="nav-item">
          <Users size={18} /> Authors
        </div>
        <div className="nav-item active">
          <BookOpen size={18} /> Inventory
        </div>
        <div className="nav-item">
          <Settings size={18} /> Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
