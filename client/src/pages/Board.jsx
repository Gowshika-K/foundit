import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Search, MapPin, Calendar } from 'lucide-react';

export default function Board() {
  const [items, setItems] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await API.get('/items');
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  const categories = [
    'All',
    ...Array.from(
      new Set(
        items
          .map((i) => (i.category ? i.category.trim() : ''))
          .filter(Boolean)
      )
    )
  ];

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));

    const matchesType =
      typeFilter === 'All' ||
      (item.type && item.type.toLowerCase() === typeFilter.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      (item.category && item.category.trim().toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesType && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        Loading items...
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1150px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search items by title, description, location, or category..."
              value={searchInput}
              onChange={handleSearchChange}
              style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: '0.65rem 1.5rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            Search
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Lost', 'Found'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  border: typeFilter === type ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                  background: typeFilter === type ? '#4f46e5' : '#fff',
                  color: typeFilter === type ? '#fff' : '#334155',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {type === 'All' ? 'All Items' : type}
              </button>
            ))}
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontSize: '0.9rem', minWidth: '160px', outline: 'none' }}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          No matching items found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((item) => (
            <Link key={item._id} to={`/items/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.image ? (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '200px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    No Photo
                  </div>
                )}

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '999px',
                      background: item.type === 'Lost' ? '#dcfce7' : '#dbeafe',
                      color: item.type === 'Lost' ? '#15803d' : '#1d4ed8'
                    }}>
                      {item.type}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.status === 'Open' ? '#10b981' : '#64748b' }}>
                      ● {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1rem 0', flex: 1 }}>
                    {item.description}
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} /> {item.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} /> {item.date}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
