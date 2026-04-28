import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BookGrid from '../components/BookGrid';

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';

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
    if (!isLoggedIn) {
      alert('Lütfen satın almak için giriş yapın veya kayıt olun.');
      return;
    }
    await fetch(`http://localhost:3001/books/${id}/buy`, { method: 'POST' });
    fetchBooks();
  };

  const handleRestock = async (id) => {
    await fetch(`http://localhost:3001/books/${id}/restock`, { method: 'POST' });
    fetchBooks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/home');
  };

  return (
    <div className="layout">
      <div className="app-container">
        {isAdmin && <Sidebar active="home" />}
        <div className="main-content">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <h1 className="header-title" style={{margin: 0}}>
              Vitrin
            </h1>
            <div>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="btn-secondary" style={{padding: '10px 20px', borderRadius: 8}}>Çıkış Yap</button>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => navigate('/login')} className="btn-secondary" style={{padding: '10px 24px', borderRadius: 8}}>Giriş</button>
                  <button onClick={() => navigate('/register')} className="btn-primary" style={{padding: '10px 24px', borderRadius: 8}}>Kayıt Ol</button>
                </div>
              )}
            </div>
          </div>
          
          <BookGrid books={books} onBuy={handleBuy} onRestock={isAdmin ? handleRestock : undefined} />
        </div>
      </div>
    </div>
  );
};

export default Home;
