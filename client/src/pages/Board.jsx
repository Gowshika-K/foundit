import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Search, MapPin, Calendar, Tag } from 'lucide-react';

const CATEGORIES = ['All', 'Wallet', 'Phone', 'ID Card', 'Keys', 'Bag', 'Books', 'Electronics', 'Other'];

export default function Board() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = `?search=${search}`;
      if (type) query += `&type=${type}`;
      if (category !== 'All') query += `&category=${category}`;

      const res = await API.get(`/items${query}`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="container">
      {/* Search and Filter Bar */}
      <div style={{ background: 'white', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search items by title or description..."
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Type Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setType('')}
              className={`btn ${type === '' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.8rem' }}
            >
              All Items
            </button>
            <button
              onClick={() => setType('lost')}
              className={`btn ${type === 'lost' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.8rem' }}
            >
              Lost
            </button>
            <button
              onClick={() => setType('found')}
              className={`btn ${type === 'found' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.8rem' }}
            >
              Found
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat} Items</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Feed */}
      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading items...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          <h3>No items found</h3>
          <p>Try searching with another keyword or post an item!</p>
        </div>
      ) : (
        <div className="grid-cards">
          {items.map((item) => (
            <Link to={`/items/${item._id}`} key={item._id} className="item-card">
              {item.image ? (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.title}
                  className="item-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x250?text=No+Photo'; }}
                />
              ) : (
                <div className="item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  No Photo
                </div>
              )}
              <div className="item-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.status === 'Open' ? '#10b981' : '#64748b' }}>
                    ● {item.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '0.8rem', flex: 1 }}>
                  {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                </p>
                <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} /> {item.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} /> {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}