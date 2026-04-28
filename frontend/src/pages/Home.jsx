import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BookGrid from '../components/BookGrid';
import CartModal from '../components/CartModal';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const handleAddToCart = (book) => {
    if (!isLoggedIn) {
      alert('Lütfen satın almak için giriş yapın veya kayıt olun.');
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        if (existing.quantity >= book.stock) {
          alert('Maksimum stok miktarına ulaştınız.');
          return prev;
        }
        return prev.map(item => item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.book.id !== bookId));
      return;
    }
    setCart(prev => prev.map(item => item.book.id === bookId ? { ...item, quantity: newQuantity } : item));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const items = cart.map(item => ({ id: item.book.id, quantity: item.quantity }));
      const res = await fetch('http://localhost:3001/books/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      });
      if (!res.ok) throw new Error('Checkout failed');
      
      alert('Siparişiniz başarıyla onaylandı!');
      setCart([]);
      setIsCartOpen(false);
      fetchBooks();
    } catch (e) {
      alert('Sipariş sırasında bir hata oluştu. Lütfen stokları kontrol edin.');
    }
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
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button onClick={() => setIsCartOpen(true)} className="btn-primary" style={{padding: '10px 20px', borderRadius: 8}}>
                    Sepet ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                  </button>
                  <button onClick={handleLogout} className="btn-secondary" style={{padding: '10px 20px', borderRadius: 8}}>Çıkış Yap</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => navigate('/login')} className="btn-secondary" style={{padding: '10px 24px', borderRadius: 8}}>Giriş</button>
                  <button onClick={() => navigate('/register')} className="btn-primary" style={{padding: '10px 24px', borderRadius: 8}}>Kayıt Ol</button>
                </div>
              )}
            </div>
          </div>
          
          <BookGrid books={books} onBuy={handleAddToCart} onRestock={isAdmin ? handleRestock : undefined} />
        </div>
      </div>
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateQuantity={updateQuantity} 
        onCheckout={handleCheckout} 
      />
    </div>
  );
};

export default Home;
