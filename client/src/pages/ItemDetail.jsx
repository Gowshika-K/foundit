import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, Tag, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Claim state
  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    const loadItemAndMatches = async () => {
      setLoading(true);
      try {
        const itemRes = await API.get(`/items/${id}`);
        setItem(itemRes.data);

        // Fetch Top 3 Match Scores
        try {
          const matchRes = await API.get(`/items/${id}/matches`);
          setMatches(matchRes.data);
        } catch (mErr) {
          console.log('Matches route might not be merged by Vikash yet.');
        }
      } catch (err) {
        console.error('Failed to load item', err);
      } finally {
        setLoading(false);
      }
    };

    loadItemAndMatches();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in first to claim this item.');
      return;
    }

    setSubmittingClaim(true);
    setClaimError('');
    try {
      const res = await API.post('/claims', {
        itemId: item._id,
        answer: claimAnswer,
      });
      setClaimResult(res.data);
      setItem({ ...item, status: 'Claimed' });
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Incorrect answer. Try again!');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Loading details...</div>;
  if (!item) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Item not found!</div>;

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        
        {/* Left Side: Photo & Information */}
        <div>
          {item.image ? (
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.title}
              style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1.2rem' }}
              onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Photo'; }}
            />
          ) : (
            <div style={{ width: '100%', height: '260px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: '#94a3b8', marginBottom: '1.2rem' }}>
              No Photo Available
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span className={`badge ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>{item.type}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.status === 'Open' ? '#10b981' : '#64748b' }}>● {item.status}</span>
          </div>

          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{item.title}</h1>
          <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1.2rem' }}>{item.description}</p>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div><strong>Category:</strong> {item.category}</div>
            <div><MapPin size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /><strong>Location:</strong> {item.location}</div>
            <div><Calendar size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
            <div><strong>Posted By:</strong> {item.postedBy?.name || 'Anonymous Student'}</div>
          </div>
        </div>

        {/* Right Side: Ownership Verification & Matches */}
        <div>
          {/* Feature 1: Ownership Verification */}
          <div style={{ background: '#fdf4ff', border: '1px solid #f0abfc', borderRadius: '10px', padding: '1.3rem', marginBottom: '1.8rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86198f', marginBottom: '0.6rem' }}>
              <ShieldCheck size={20} /> Ownership Check
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#701a75', marginBottom: '1rem' }}>
              To protect privacy, the finder's contact is hidden. Answer the finder's secret question to verify it is yours!
            </p>

            <div style={{ background: 'white', padding: '0.8rem', borderRadius: '6px', border: '1px solid #f5d0fe', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.88rem', color: '#6b21a8' }}>Question:</strong>
              <div style={{ marginTop: '0.2rem', fontWeight: 600 }}>{item.verifyQuestion}</div>
            </div>

            {claimResult ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '8px', color: '#065f46' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <UserCheck size={18} /> Verification Success!
                </div>
                <div><strong>Finder:</strong> {claimResult.contact?.name}</div>
                <div><strong>Email:</strong> {claimResult.contact?.email}</div>
                <div style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: '#047857' }}>You can now email them directly to collect your item.</div>
              </div>
            ) : item.status !== 'Open' ? (
              <div style={{ color: '#64748b', fontWeight: 600 }}>This item has already been claimed or returned.</div>
            ) : (
              <form onSubmit={handleClaimSubmit}>
                {claimError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{claimError}</div>}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Type your secret answer..."
                    className="form-control"
                    required
                    value={claimAnswer}
                    onChange={(e) => setClaimAnswer(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submittingClaim}>
                  {submittingClaim ? 'Checking...' : 'Submit Answer to Unlock Contact'}
                </button>
              </form>
            )}
          </div>

          {/* Feature 2: Top 3 Match Scores */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.1rem', marginBottom: '0.8rem' }}>
              <Sparkles size={18} color="#4f46e5" /> Suggested Matches
            </h3>

            {matches.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No high-probability matches found yet.</p>
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
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.item?.location} • {m.item?.category}</div>
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