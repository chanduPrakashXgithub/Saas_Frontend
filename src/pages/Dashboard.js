// src/pages/Dashboard.js
import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/users/me')
      .then(res => {
        console.log("User data:", res.data); // 👈 add this for debugging
  
        const userData = res.data;
  
        if (userData && typeof userData === 'object') {
          setUser({
            name: userData.name ?? 'User',
            email: userData.email ?? 'Not provided',
            bio: userData.bio ?? ''
          });
          setBio(userData.bio ?? '');
        } else {
          setUser({ name: 'User', email: 'Not provided', bio: '' });
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        navigate('/login');
      });
  }, [navigate]);
  

  const handleUpdate = async () => {
    try {
      const res = await API.put('/users/me', { bio });
      if (res.data && typeof res.data === 'object') {
        setUser({
          name: res.data.name || 'User',
          email: res.data.email || 'Not provided',
          bio: res.data.bio || ''
        });
        setBio(res.data.bio || '');
      }
      alert('Profile updated');
    } catch {
      alert('Failed to update');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete('/users/me');
      localStorage.removeItem('token');
      navigate('/');
    } catch {
      alert('Failed to delete');
    }
  };

  if (!user) return <div className="dashboard-container"><div className="dashboard-card">Loading...</div></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '0.5rem', color: '#4f46e5' }}>
          Welcome, {user.name}
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.7rem' }}>
          <strong>Email:</strong> {user.email}
        </p>
        <div className="dashboard-bio" style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="bio" style={{ marginRight: '0.5rem' }}><strong>Bio:</strong></label>
          <input
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              width: '70%',
              padding: '0.7rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
          />
        </div>
        <div className="dashboard-actions">
          <button className="primary" style={{ minWidth: '120px' }} onClick={handleUpdate}>
            Update Bio
          </button>
          <button className="danger" style={{ minWidth: '120px' }} onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
