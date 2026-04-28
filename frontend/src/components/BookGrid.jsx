import React from 'react';

const BookGrid = ({ books, onBuy, onRestock }) => {
  if (!books || books.length === 0) {
    return <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>Envanterde ürün bulunamadı.</div>;
  }

  return (
    <div className="book-grid">
      {books.map(book => (
        <div key={book.id} className="book-card">
          <div className="book-cover-container">
            {book.coverImage !== 'error' ? (
              <img src={book.coverImage} alt={book.title} className="book-cover" />
            ) : (
              <div className="book-placeholder">☒</div>
            )}
          </div>
          <h4 className="book-title" style={{marginBottom: 6, fontSize: '1.1rem'}}>{book.title}</h4>
          <span className="book-subtitle" style={{marginBottom: 20}}>{book.author}</span>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto', paddingTop: 15, borderTop: '1px solid var(--border-color)'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Fiyat</span>
                <span style={{fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem'}}>{book.price === 0 || book.price === 999999 ? `$${book.price.toFixed(2)}` : `₺${book.price.toFixed(2)}`}</span>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                {book.stock > 0 ? (
                  <button className="btn-primary" style={{padding: '8px 18px', borderRadius: 8, fontSize: '0.85rem'}} onClick={() => onBuy(book)}>Sepete Ekle</button>
                ) : (
                  <>
                    <span style={{color: 'var(--danger-color)', fontWeight: 600, fontSize: '0.85rem', marginTop: 10}}>Tükendi</span>
                    {onRestock && <button className="btn-secondary" style={{padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', marginTop: 5}} onClick={() => onRestock(book.id)}>+ Stok</button>}
                  </>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;
