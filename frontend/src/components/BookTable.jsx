import React from 'react';

const BookTable = ({ books, onBuy }) => {
  return (
    <div className="card table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Book List</th>
            <th>Authors</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Cover Images</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>
                <div className="book-title">{book.title}</div>
                {book.subtitle && <div className="book-subtitle">{book.subtitle}</div>}
              </td>
              <td>{book.author}</td>
              <td>{book.price === 0 || book.price === 999999 ? `$${book.price.toFixed(2)}` : `₺${book.price.toFixed(2)}`}</td>
              <td>{book.stock}</td>
              <td>
                {book.coverImage !== 'error' ? (
                  <img src={book.coverImage} alt={book.title} style={{ width: 40, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                  <div style={{ width: 40, height: 60, background: 'var(--text-secondary)', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                     <span style={{color: '#fff', fontSize: 24}}>☒</span>
                  </div>
                )}
              </td>
              <td>
                {book.stock > 0 ? (
                  <button className="btn-primary" style={{padding: '6px 12px', borderRadius: 6, fontSize: '0.8rem'}} onClick={() => onBuy(book.id)}>Buy</button>
                ) : (
                  <span style={{color: '#ef4444', fontWeight: 600, fontSize: '0.85rem'}}>Stokta kalmadı</span>
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
