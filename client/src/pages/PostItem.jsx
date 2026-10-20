import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = ['Wallet', 'Phone', 'ID Card', 'Keys', 'Bag', 'Books', 'Electronics', 'Other'];
const LOCATIONS = ['Library', 'Canteen', 'Hostel', 'Bus Stop', 'Ground', 'Classroom', 'Admin Block', 'Other'];

export default function PostItem() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'Wallet',
    location: 'Library',
    date: new Date().toISOString().split('T')[0],
    verifyQuestion: '',
    verifyAnswer: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      alert('Please log in first to post an item.');
      navigate('/login');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Item posted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '1.2rem', textAlign: 'center' }}>Post an Item</h2>
        {error && <div style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Type</label>
            <select
              className="form-control"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="lost">Lost (I lost this item)</option>
              <option value="found">Found (I found this item)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Black Titan Wallet"
              className="form-control"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              placeholder="Describe color, brand, distinct scratches, contents..."
              className="form-control"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Date Lost/Found</label>
              <input
                type="date"
                className="form-control"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Secret Ownership Question Check */}
          <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#1e293b' }}>
              🔒 Secret Verification (Ownership Check)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.8rem' }}>
              Set a question only the true owner can answer before seeing your contact info.
            </div>

            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                placeholder="e.g. What picture is inside the ID card slot?"
                className="form-control"
                required
                value={formData.verifyQuestion}
                onChange={(e) => setFormData({ ...formData, verifyQuestion: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Correct Answer (Secret)</label>
              <input
                type="text"
                placeholder="e.g. Cat sticker"
                className="form-control"
                required
                value={formData.verifyAnswer}
                onChange={(e) => setFormData({ ...formData, verifyAnswer: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Post Item Now'}
          </button>
        </form>
      </div>
    </div>
  );
}