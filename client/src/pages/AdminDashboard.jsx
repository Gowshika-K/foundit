import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShieldAlert, CheckCircle, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalItems: 0, lostCount: 0, foundCount: 0, totalUsers: 0 });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      alert('Access Denied: Admins only');
      navigate('/admin-login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          API.get('/items/admin/stats'),
          API.get('/items?showAll=true') // Admin sees ALL items (Open, Claimed, Returned)
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

  // Admin marks item as Returned (Takes it off public feed!)
  const handleMarkReturned = async (id) => {
    try {
      await API.patch(`/items/${id}/status`, { status: 'Returned' });
      setItems(items.map(it => it._id === id ? { ...it, status: 'Returned' } : it));
      alert('Item marked as Returned! It is now hidden from the public feed.');
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Admin deletes item completely
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

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Admin Portal...</div>;

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <ShieldAlert size={28} color="#7c3aed" />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Admin Moderation & Responsibility Portal</h2>
      </div>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
        As the administrator, you oversee all campus handovers. Once an item is handed over, mark it as <strong>Returned</strong> to remove it from the public feed.
      </p>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Total Posts</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4f46e5', marginTop: '0.2rem' }}>{stats.totalItems}</div>
        </div>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Active Lost Items</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', marginTop: '0.2rem' }}>{stats.lostCount}</div>
        </div>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Active Found Items</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>{stats.foundCount}</div>
        </div>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Registered Users</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: '0.2rem' }}>{stats.totalUsers}</div>
        </div>
      </div>

      {/* Management Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '0.9rem 1rem' }}>Item Title</th>
              <th style={{ padding: '0.9rem 1rem' }}>Type</th>
              <th style={{ padding: '0.9rem 1rem' }}>Status</th>
              <th style={{ padding: '0.9rem 1rem' }}>Location & Time</th>
              <th style={{ padding: '0.9rem 1rem' }}>Posted By</th>
              <th style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>{it.title}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, background: it.type === 'lost' ? '#fee2e2' : '#d1fae5', color: it.type === 'lost' ? '#b91c1c' : '#047857' }}>
                    {it.type}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ fontWeight: 700, color: it.status === 'Open' ? '#10b981' : '#64748b' }}>
                    ● {it.status}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: '#64748b' }}>{it.location} • {it.timeFound || 'N/A'}</td>
                <td style={{ padding: '0.9rem 1rem' }}>{it.postedBy?.name || 'Student'}</td>
                <td style={{ padding: '0.9rem 1rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {it.status === 'Open' && (
                    <button
                      onClick={() => handleMarkReturned(it._id)}
                      style={{ padding: '0.35rem 0.7rem', background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <CheckCircle size={13} /> Mark Returned
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteItem(it._id)}
                    style={{ padding: '0.35rem 0.65rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecdd3', borderRadius: '6px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}