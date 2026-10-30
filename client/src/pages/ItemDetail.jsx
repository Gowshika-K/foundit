import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Clock, Phone, Mail, Sparkles, User, Trash2, CheckCircle } from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);

        try {
          const matchRes = await API.get(`/items/${id}/matches`);
          setMatches(matchRes.data);
        } catch (mErr) {
          console.log('Matches endpoint response unavailable');
        }
      } catch (err) {
        console.error('Error loading item', err);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/items/${id}`);
      alert('Post deleted.');
      navigate('/');
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Loading post details...</div>;
  if (!item) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Post not found!</div>;

  const isOwnerOrAdmin = user && (user.id === item.postedBy?._id || user.id === item.postedBy || user.role === 'admin');

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        
        {/* Left Side: Photo & Specs */}
        <div>
          {item.image ? (
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.title}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1.2rem' }}
              onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Photo+Uploaded'; }}
            />
          ) : (
            <div style={{ width: '100%', height: '260px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: '#94a3b8', border: '1px dashed #cbd5e1', marginBottom: '1.2rem' }}>
              No Photo Uploaded
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>{item.type}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.status === 'Open' ? '#10b981' : '#64748b' }}>
                ● {item.status}
              </span>
            </div>
            {isOwnerOrAdmin && (
              <button onClick={handleDelete} className="btn btn-danger" style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem' }}>
                <Trash2 size={15} /> Delete Post
              </button>
            )}
          </div>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{item.title}</h1>
          <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1.4rem' }}>{item.description}</p>

          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.7rem', fontSize: '0.9rem' }}>
            <div><strong>Category:</strong> {item.category}</div>
            <div><MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#64748b' }} /><strong>Campus Location:</strong> {item.location}</div>
            <div><Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#64748b' }} /><strong>Date Reported:</strong> {new Date(item.date).toLocaleDateString()}</div>
            <div><Clock size={16} style={{ verticalAlign: 'middle', marginRight: '6px', color: '#64748b' }} /><strong>Time (Lost/Found):</strong> {item.timeFound || 'N/A'}</div>
          </div>
        </div>

        {/* Right Side: Contact & AI Match Recommendations */}
        <div>
          {/* Professional Contact Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.4rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b' }}>
              <User size={18} color="#4f46e5" /> Contact Details
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.2rem' }}>
              Get in touch with the student who reported this item:
            </p>

            <div style={{ background: 'white', padding: '1.2rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Posted By</span>
                <strong style={{ fontSize: '1rem' }}>{item.postedBy?.name || 'Campus Student'}</strong>
              </div>

              {/* Action: Send Email Button */}
              <a
                href={`mailto:${item.postedBy?.email}?subject=Regarding your FoundIt post: ${item.title}`}
                className="btn btn-primary"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <Mail size={16} /> Send Email ({item.postedBy?.email})
              </a>

              {/* Action: WhatsApp / Call Button (if phone exists) */}
              {item.contactPhone && (
                <a
                  href={`tel:${item.contactPhone}`}
                  className="btn btn-outline"
                  style={{ width: '100%', textDecoration: 'none', color: '#16a34a', borderColor: '#bbf7d0' }}
                >
                  <Phone size={16} /> Call / WhatsApp ({item.contactPhone})
                </a>
              )}
            </div>
          </div>

          {/* Smart Suggested Matches */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.1rem', marginBottom: '0.8rem', color: '#1e293b' }}>
              <Sparkles size={18} color="#4f46e5" /> Suggested Matches
            </h3>

            {matches.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No corresponding items matching this report yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {matches.map((m, idx) => (
                  <Link
                    to={`/items/${m.item?._id}`}
                    key={idx}
                    style={{ textDecoration: 'none', color: 'inherit', background: 'white', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.item?.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.item?.location} • {m.item?.timeFound}</div>
                    </div>
                    <span className="badge badge-score" style={{ fontSize: '0.82rem' }}>
                      {m.score}% Match
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}