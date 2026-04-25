import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BookTable from '../components/BookTable';

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const bRes = await fetch('http://localhost:3001/books');
      const bData = await bRes.json();
      setBooks(bData);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBuy = async (id) => {
    await fetch(`http://localhost:3001/books/${id}/buy`, { method: 'POST' });
    fetchBooks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="layout">
      <div className="app-container">
        {isAdmin && <Sidebar active="home" />}
        <div className="main-content">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <h1 className="header-title" style={{margin: 0}}>
              Vitrin (Showcase)
            </h1>
            <div>
              {isAdmin ? (
                <button onClick={handleLogout} className="btn-secondary" style={{padding: '10px 20px', borderRadius: 8}}>Logout</button>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-primary" style={{padding: '10px 24px', borderRadius: 8}}>Sign In</button>
              )}
            </div>
          </div>
          
          <BookTable books={books} onBuy={handleBuy} />
        </div>
      </div>
    </div>
  );
};

export default Home;
