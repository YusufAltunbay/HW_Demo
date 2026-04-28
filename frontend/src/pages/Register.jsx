import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      if (res.ok) {
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        navigate('/login');
      } else {
        const errorData = await res.json();
        alert('Kayıt başarısız: ' + (errorData.message || 'Hata'));
      }
    } catch (e) {
      console.error(e);
      alert('Bağlantı hatası.');
    }
  };

  return (
    <div className="modern-login-wrap">
      <div className="modern-login-card">
        <h2 style={{ marginBottom: 30, textAlign: 'center', fontSize: '1.8rem', fontWeight: 600, color: '#1e293b' }}>Kayıt Ol</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="modern-input"
            required
          />
          <input 
            type="email" 
            placeholder="E-posta Adresi" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="modern-input"
            required
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="modern-input"
            required
          />
          <button type="submit" className="modern-btn">
            Kayıt Ol
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
