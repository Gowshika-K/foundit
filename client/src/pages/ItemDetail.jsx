import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, ShieldCheck, UserCheck, ArrowLeft } from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [claimAnswer, setClaimAnswer] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        const itemRes = await API.get(`/items/${id}`);
        setItem(itemRes.data);
      } catch (err) {
        console.error('Failed to load item', err);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
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
      setItem({ ...item, status: 'Claimed', phone: res.data.contact?.phone || item.phone });
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Incorrect answer. Try again!');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Loading details...</div>;
  if (!item) return <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>Item not found!</div>;

  const displayPhone = claimResult?.contact?.phone || item.phone;

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '3rem', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Items List
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{item.title}</h1>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, background: item.type === 'Lost' ? '#3b82f6' : '#10b981', color: 'white' }}>
              {item.type}
            </span>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, background: item.status === 'Open' ? '#f59e0b' : '#64748b', color: 'white' }}>
              {item.status}
            </span>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, background: '#e2e8f0', color: '#334155' }}>
              {item.category}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', background: 'white', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div>
          {item.image ? (
            <img src={`http://localhost:5000${item.image}`} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            <div style={{ width: '100%', height: '300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#94a3b8' }}>
              No Photo Available
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#4f46e5', marginBottom: '0.3rem' }}>Description</h3>
            <p style={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.description}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#4f46e5', marginBottom: '0.3rem' }}>Location</h3>
            <p style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} color="#64748b" /> {item.location}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#4f46e5', marginBottom: '0.3rem' }}>Date</h3>
            <p style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="#64748b" /> {item.date}
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={20} color="#4f46e5" /> Contact Information
            </h3>

            {claimResult || item.status !== 'Open' ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '8px', color: '#065f46', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserCheck size={18} /> Verification Success!
                </div>
                <div><strong>Name:</strong> {claimResult?.contact?.name || item.postedBy?.name || 'Finder'}</div>
                <div><strong>Email:</strong> {claimResult?.contact?.email || item.postedBy?.email || 'Not available'}</div>
                <div><strong>Phone:</strong> {displayPhone || 'Not provided'}</div>
                <div style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: '#047857' }}>You can now contact them directly.</div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                  Answer the secret question to verify and unlock contact info!
                </p>
                <div style={{ marginBottom: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Question: <span style={{ color: '#4f46e5', fontStyle: 'italic' }}>{item.verifyQuestion}</span>
                </div>
                <form onSubmit={handleClaimSubmit}>
                  {claimError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{claimError}</div>}
                  <div style={{ marginBottom: '0.8rem' }}>
                    <input
                      type="text"
                      placeholder="Type your secret answer..."
                      className="form-control"
                      required
                      value={claimAnswer}
                      onChange={(e) => setClaimAnswer(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '0.6rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }} disabled={submittingClaim}>
                    {submittingClaim ? 'Checking...' : 'Submit Answer to Unlock Contact'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
