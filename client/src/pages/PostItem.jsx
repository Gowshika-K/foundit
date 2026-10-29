import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function PostItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Lost',
    title: '',
    description: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    phone: '',
    verifyQuestion: '',
    verifyAnswer: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('date', formData.date);
      data.append('phone', formData.phone);
      data.append('verifyQuestion', formData.verifyQuestion);
      data.append('question', formData.verifyQuestion);
      data.append('verifyAnswer', formData.verifyAnswer);
      if (image) {
        data.append('image', image);
      }

      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '560px', margin: '2rem auto' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0f172a' }}>Post an Item</h2>

        {error && <div style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Item Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="Lost">Lost (I lost this item)</option>
              <option value="Found">Found (I found this item)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Black Titan Wallet"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Description</label>
            <textarea
              name="description"
              placeholder="Describe color, brand, distinct scratches, contents..."
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="form-control"
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Wallet, Bag, Keys, ID Card"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Ground floor guard cabin"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Contact Number (Phone / WhatsApp)</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Date Lost/Found</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="form-control"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Secret Verification (Ownership Check)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Set a question only the true owner can answer before seeing your contact info.
            </p>

            <div className="form-group" style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Question</label>
              <input
                type="text"
                name="verifyQuestion"
                placeholder="e.g. What picture is inside the ID card slot?"
                value={formData.verifyQuestion}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Correct Answer (Secret)</label>
              <input
                type="text"
                name="verifyAnswer"
                placeholder="e.g. Cat sticker"
                value={formData.verifyAnswer}
                onChange={handleChange}
                required
                className="form-control"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            {loading ? 'Posting...' : 'Post Item Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
