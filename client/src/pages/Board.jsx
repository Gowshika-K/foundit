import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Search, MapPin, Calendar, Clock, PlusCircle } from 'lucide-react';

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
    <div>
      {/* Clean Hero Header */}
      <div style={{ background: 'linear-gradient(180deg, #e0e7ff 0%, #f8fafc 100%)', padding: '3.5rem 1.5rem 2.5rem', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', letterSpacing: '-0.5px' }}>
          Campus <span style={{ color: '#4f46e5' }}>Lost & Found</span> Portal
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.8rem', lineHeight: '1.5' }}>
          Report missing belongings or find lost items across campus libraries, hostels, labs, and grounds.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
          <Link
            to="/post"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#4f46e5',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.92rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <PlusCircle size={17} /> Report Lost or Found
          </Link>
          <a
            href="#feed"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.92rem',
              textDecoration: 'none',
            }}
          >
            Browse Posts
          </a>
        </div>

        {/* Stats Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ background: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5' }}>{items.length} </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Total Reports</span>
          </div>
          <div style={{ background: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{items.filter(i => i.type === 'lost').length} </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Lost Items</span>
          </div>
          <div style={{ background: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{items.filter(i => i.type === 'found').length} </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Found Items</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div id="feed" style={{ maxWidth: '1140px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Search & Filter Bar */}
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)', marginBottom: '2rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', top: '13px', left: '12px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by keywords (e.g. 'black wallet', 'titan', 'laptop charger')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', height: '44px', padding: '0 1rem 0 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '0 1.4rem', height: '44px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              Search
            </button>
          </form>

          {/* Toggle Pills & Category */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setType('')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid #cbd5e1',
                  background: type === '' ? '#4f46e5' : '#ffffff',
                  color: type === '' ? '#ffffff' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                All Posts
              </button>
              <button
                type="button"
                onClick={() => setType('lost')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid #cbd5e1',
                  background: type === 'lost' ? '#ef4444' : '#ffffff',
                  color: type === 'lost' ? '#ffffff' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                🔴 Lost Items
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: '1px solid #cbd5e1',
                  background: type === 'found' ? '#10b981' : '#ffffff',
                  color: type === 'found' ? '#ffffff' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                🟢 Found Items
              </button>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', background: '#ffffff', outline: 'none' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c} Items</option>)}
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading records...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#0f172a' }}>No Items Found</h3>
            <p style={{ color: '#64748b', marginBottom: '1.2rem', fontSize: '0.9rem' }}>Be the first student to post a lost or found report!</p>
            <Link
              to="/post"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#4f46e5', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}
            >
              <PlusCircle size={16} /> Post an Item Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.6rem' }}>
            {items.map(item => (
              <Link
                to={`/items/${item._id}`}
                key={item._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                }}
              >
                {item.image ? (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    style={{ width: '100%', height: '190px', objectFit: 'cover', background: '#f1f5f9' }}
                    onError={(e) => { e.target.src = 'https://placehold.co/400x250?text=No+Photo'; }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: '0.88rem' }}>
                    No Photo Provided
                  </div>
                )}
                
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: item.type === 'lost' ? '#fee2e2' : '#d1fae5',
                        color: item.type === 'lost' ? '#b91c1c' : '#047857',
                      }}
                    >
                      {item.type}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: item.status === 'Open' ? '#10b981' : '#64748b' }}>
                      ● {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.1rem', flex: 1 }}>
                    {item.description.length > 75 ? item.description.substring(0, 75) + '...' : item.description}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.82rem', color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} color="#4f46e5" /> {item.location}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} color="#94a3b8" /> {new Date(item.date).toLocaleDateString()}
                      </span>
                      {item.timeFound && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                          <Clock size={14} /> {item.timeFound}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}