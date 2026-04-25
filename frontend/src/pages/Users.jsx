import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const isAdmin = !!localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/users');
      const data = await res.json();
      setUsers(data);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async(e) => {
    e.preventDefault();
    if(!username) return;
    await fetch('http://localhost:3001/users', { 
       method: 'POST', headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({username, email})
    });
    setUsername(''); setEmail(''); fetchUsers();
  };

  const handleDelete = async(id) => {
    await fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className="layout">
      <div className="app-container">
        <Sidebar active="authors" />
        <div className="main-content">
          <h1 className="header-title" style={{marginBottom: 30}}>User / Author Management</h1>
          <div className="card table-wrapper">
             <table style={{width: '100%'}}>
               <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Action</th></tr></thead>
               <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td><td>{u.username}</td><td>{u.email}</td>
                      <td>
                        {isAdmin && <button className="btn-secondary" style={{padding: '6px 12px', borderRadius: 6, fontSize: '0.8rem'}} onClick={() => handleDelete(u.id)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>

          {isAdmin && (
            <div className="card" style={{marginTop: 30}}>
              <h3 style={{marginBottom: 16, fontSize: '1.1rem', fontWeight: 600}}>Add New User</h3>
              <form onSubmit={handleAddUser} style={{display: 'flex', gap: 15}}>
                 <input className="modern-input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
                 <input className="modern-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                 <button className="btn-primary" style={{padding: '12px 24px', borderRadius: 8}}>Add</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
