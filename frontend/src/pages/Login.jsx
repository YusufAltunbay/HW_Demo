import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        localStorage.setItem('token', 'admin-token');
        navigate('/dashboard');
      } else {
        alert('Geçersiz giriş bilgileri.');
      }
    } catch (e) {
      console.error(e);
      alert('Bağlantı hatası.');
    }
  };

  return (
    <div className="modern-login-wrap">
      <div className="modern-login-card">
        <h2 style={{ marginBottom: 30, textAlign: 'center', fontSize: '1.8rem', fontWeight: 600, color: '#1e293b' }}>Yönetici Girişi</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            className="modern-input"
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="modern-input"
          />
          <button type="submit" className="modern-btn">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
