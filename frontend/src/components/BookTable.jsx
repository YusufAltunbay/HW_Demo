import React from 'react';

const BookTable = ({ books, onBuy, onRestock }) => {
  if (!books || books.length === 0) {
    return <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-secondary)'}}>Envanterde ürün bulunamadı.</div>;
  }

  return (
    <div className="card table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Kapak</th>
            <th>Kitap Adı</th>
            <th>Yazar</th>
            <th>Fiyat</th>
            <th>Stok</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>
                <div style={{width: 50, height: 75, overflow: 'hidden', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                  {book.coverImage !== 'error' ? (
                    <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span style={{color: '#94a3b8', fontSize: 18}}>☒</span>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{book.title}</div>
              </td>
              <td style={{color: 'var(--text-secondary)'}}>{book.author}</td>
              <td style={{fontWeight: 600}}>{book.price === 0 || book.price === 999999 ? `$${book.price.toFixed(2)}` : `₺${book.price.toFixed(2)}`}</td>
              <td>{book.stock}</td>
              <td>
                {book.stock > 0 ? (
                  <button className="btn-primary" style={{padding: '6px 14px', borderRadius: 8, fontSize: '0.85rem'}} onClick={() => onBuy(book.id)}>Satın Al</button>
                ) : (
                  <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                    <span style={{color: 'var(--danger-color)', fontWeight: 600, fontSize: '0.85rem'}}>Tükendi</span>
                    {onRestock && <button className="btn-secondary" style={{padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem'}} onClick={() => onRestock(book.id)}>+ Stok</button>}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
