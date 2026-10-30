import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShieldAlert, Package, Users, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalItems: 0, lostCount: 0, foundCount: 0, totalUsers: 0 });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in as Admin, kick out to Admin Login!
    if (!user || user.role !== 'admin') {
      alert('Access Denied: Admins only');
      navigate('/admin-login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          API.get('/items/admin/stats'),
          API.get('/items')
        ]);
        setStats(statsRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('ADMIN ACTION: Permanently remove this item from the platform?')) return;
    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      setStats(prev => ({ ...prev, totalItems: prev.totalItems - 1 }));
      alert('Item deleted by Admin.');
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Loading Admin Portal...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <ShieldAlert size={28} color="#8b5cf6" />
        <h2>Admin Management Dashboard</h2>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Posts</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4f46e5' }}>{stats.totalItems}</div>
        </div>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Lost Items</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>{stats.lostCount}</div>
        </div>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Found Items</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>{stats.foundCount}</div>
        </div>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Registered Users</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#8b5cf6' }}>{stats.totalUsers}</div>
        </div>
      </div>

      {/* Moderation Table */}
      <h3 style={{ marginBottom: '1rem' }}>All Campus Posts (Admin Moderation)</h3>
      <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '0.8rem 1rem' }}>Title</th>
              <th style={{ padding: '0.8rem 1rem' }}>Type</th>
              <th style={{ padding: '0.8rem 1rem' }}>Location</th>
              <th style={{ padding: '0.8rem 1rem' }}>Time</th>
              <th style={{ padding: '0.8rem 1rem' }}>Posted By</th>
              <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No posts available in the system.</td>
              </tr>
            ) : (
              items.map(it => (
                <tr key={it._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{it.title}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>
                    <span className={`badge ${it.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>{it.type}</span>
                  </td>
                  <td style={{ padding: '0.8rem 1rem' }}>{it.location}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{it.timeFound || 'N/A'}</td>
                  <td style={{ padding: '0.8rem 1rem' }}>{it.postedBy?.name || 'Student'}</td>
                  <td style={{ padding: '0.8rem 1rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <Link to={`/items/${it._id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                      <Eye size={14} /> View
                    </Link>
                    <button onClick={() => handleDeleteItem(it._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}