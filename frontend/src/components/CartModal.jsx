import React from 'react';

const CartModal = ({ isOpen, onClose, cart, updateQuantity, onCheckout }) => {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '90%', maxWidth: 500, padding: 30, position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 15, right: 15, background: 'none', 
          border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)'
        }}>✕</button>
        
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Sepetim</h2>
        
        {cart.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Sepetiniz şu an boş.</p>
        ) : (
          <div>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 20 }}>
              {cart.map((item) => (
                <div key={item.book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottom: '1px solid var(--border-color)', paddingBottom: 15 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.book.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Fiyat: ₺{item.book.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQuantity(item.book.id, item.quantity - 1)} className="btn-secondary" style={{ padding: '4px 8px', borderRadius: 4 }}>-</button>
                    <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.book.id, item.quantity + 1)} className="btn-secondary" style={{ padding: '4px 8px', borderRadius: 4 }} disabled={item.quantity >= item.book.stock}>+</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTop: '2px solid var(--border-color)', marginBottom: 20 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Toplam:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>₺{total.toFixed(2)}</span>
            </div>
            
            <button onClick={onCheckout} className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: 8, fontSize: '1rem', fontWeight: 600 }}>
              Siparişi Onayla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
