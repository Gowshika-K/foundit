import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

export default function MyPosts() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyItems = async () => {
      try {
        const res = await API.get('/items');
        // Filter items posted by current user
        const myItems = res.data.filter((it) => it.postedBy === user.id || it.postedBy?._id === user.id);
        setItems(myItems);
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await API.delete(`/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
      alert('Item deleted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  if (loading) return <div className="container">Loading your posts...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.2rem' }}>My Posted Items</h2>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          <h3>You haven't posted any items yet.</h3>
          <Link to="/post" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Post an Item
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.title}
                  className="item-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x250?text=No+Photo'; }}
                />
              )}
              <div className="item-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>{item.type}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.status}</span>
                </div>
                <h3>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0.5rem 0 1rem', flex: 1 }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to={`/items/${item._id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.85rem' }}>
                    View
                  </Link>
                  <button onClick={() => handleDelete(item._id)} className="btn btn-danger" style={{ padding: '0.3rem 0.7rem' }}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}