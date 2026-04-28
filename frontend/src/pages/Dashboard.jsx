import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BookTable from '../components/BookTable';
import RevenueChart from '../components/RevenueChart';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCoverImage, setNewCoverImage] = useState('');
  const [newStock, setNewStock] = useState('5');

  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('token');

  // Check if backend has junk data using metrics type
  const isJunk = metrics.some(m => m.isTest);
  const isEmpty = books.length === 0;

  const fetchData = async () => {
    setLoading(true);
    try {
      const resBooks = await fetch('http://localhost:3001/books');
      const booksData = await resBooks.json();
      setBooks(booksData);

      const resMetrics = await fetch('http://localhost:3001/metrics');
      const metricsData = await resMetrics.json();
      setMetrics(metricsData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdminReset = useCallback(async () => {
    try {
      // Golden state seed now simply clears data based on backend update!
      await fetch('http://localhost:3001/admin/reset', { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleJunkSeed = async () => {
    await fetch('http://localhost:3001/admin/junk', { method: 'POST' });
    fetchData();
  };

  const handleSoftReset = async () => {
    await fetch('http://localhost:3001/admin/reset-test', { method: 'POST' });
    fetchData();
  };

  const handleBuy = async (id) => {
    await fetch(`http://localhost:3001/books/${id}/buy`, { method: 'POST' });
    fetchData();
  };

  const handleRestock = async (id) => {
    await fetch(`http://localhost:3001/books/${id}/restock`, { method: 'POST' });
    fetchData();
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if(!newTitle || !newAuthor || !newPrice) return;
    try {
      await fetch('http://localhost:3001/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          author: newAuthor,
          price: parseFloat(newPrice),
          subtitle: '',
          coverImage: newCoverImage || 'error',
          stock: parseInt(newStock) || 0,
        })
      });
      setNewTitle('');
      setNewAuthor('');
      setNewPrice('');
      setNewCoverImage('');
      setNewStock('5');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/home');
  };

  // Hidden Keyboard Shortcut: Shift + R
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'r') {
        isAdmin && handleAdminReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdminReset, isAdmin]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="layout">
      <div className="app-container">
        {isAdmin && <Sidebar />}
        <div className="main-content">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
            <h1 className="header-title" style={{margin: 0}}>
              {isJunk ? 'Yönetim Paneli - Test Şubesi' : isEmpty ? 'Yönetim Paneli - Temiz Veri' : 'Yönetim Paneli'}
            </h1>
            <div>
              {isAdmin ? (
                <button onClick={handleLogout} className="btn-secondary" style={{padding: '10px 20px', borderRadius: 8}}>Çıkış Yap</button>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-primary" style={{padding: '10px 24px', borderRadius: 8}}>Giriş</button>
              )}
            </div>
          </div>
          
          <BookTable books={books} onBuy={handleBuy} onRestock={isAdmin ? handleRestock : undefined} />
          
          {isAdmin && (
            <div className="card" style={{marginTop: 30}}>
              <h3 style={{marginBottom: 16, fontSize: '1.1rem', fontWeight: 600}}>Yeni Ekle (Manuel)</h3>
              <form onSubmit={handleAddBook} style={{display: 'flex', gap: 15, flexWrap: 'wrap'}}>
                 <input placeholder="Kitap Adı" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{flex: 1, minWidth: 120, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <input placeholder="Yazar Adı" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} style={{flex: 1, minWidth: 120, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <input placeholder="Fiyat" type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{width: 100, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <input placeholder="Stok" type="number" value={newStock} onChange={e => setNewStock(e.target.value)} style={{width: 90, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <input placeholder="Görsel (Link)" value={newCoverImage} onChange={e => setNewCoverImage(e.target.value)} style={{flex: 1, minWidth: 150, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <button type="submit" className="btn-primary" style={{padding: '12px 24px', borderRadius: 8}}>Ekle</button>
              </form>
            </div>
          )}

          <RevenueChart data={metrics} />

          {isAdmin && (
            <div style={{ display: 'flex', gap: 15, justifyContent: 'flex-end', marginTop: 20, marginBottom: 20 }}>
              <button 
                className="admin-reset-btn" 
                onClick={handleAdminReset}
              >
                Tüm Verileri Sıfırla
              </button>
              <button 
                className="admin-reset-btn" 
                onClick={handleSoftReset}
              >
                Test Verisini Temizle
              </button>
              <button 
                className="admin-reset-btn danger" 
                onClick={handleJunkSeed}
              >
                Test Verisi Oluştur
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
