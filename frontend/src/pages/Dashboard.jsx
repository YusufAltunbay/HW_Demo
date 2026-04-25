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

  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem('token');

  // Check if backend has junk data using metrics type
  const isJunk = metrics.length > 0 && metrics[0].type === 'sales';
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

  const handleBuy = async (id) => {
    await fetch(`http://localhost:3001/books/${id}/buy`, { method: 'POST' });
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
        })
      });
      setNewTitle('');
      setNewAuthor('');
      setNewPrice('');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
              {isJunk ? 'Inventory - Test Env.' : isEmpty ? 'Inventory Dashboard - Clean' : 'Inventory Dashboard'}
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
          
          {isAdmin && (
            <div className="card" style={{marginTop: 30}}>
              <h3 style={{marginBottom: 16, fontSize: '1.1rem', fontWeight: 600}}>Add New Data (Manual)</h3>
              <form onSubmit={handleAddBook} style={{display: 'flex', gap: 15}}>
                 <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <input placeholder="Author" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} style={{flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <input placeholder="Price" type="number" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{width: 120, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)'}} />
                 <button type="submit" className="btn-primary" style={{padding: '12px 24px', borderRadius: 8}}>Add Book</button>
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
                Clear Data (Reset)
              </button>
              <button 
                className="admin-reset-btn danger" 
                onClick={handleJunkSeed}
              >
                Inject Junk Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
