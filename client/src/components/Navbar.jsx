import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, LogOut, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontSize: '1.35rem', fontWeight: 800, color: '#4f46e5' }}>
          <Sparkles size={22} color="#4f46e5" />
          <span>FoundIt</span>
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '0.9rem' }}>
            Explore Feed
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ede9fe', color: '#6d28d9', padding: '0.45rem 0.85rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                  <ShieldAlert size={15} /> Admin Panel
                </Link>
              ) : (
                <>
                  <Link to="/post" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#4f46e5', color: '#ffffff', padding: '0.45rem 0.9rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                    <PlusCircle size={15} /> Post Item
                  </Link>
                  <Link to="/my-posts" style={{ textDecoration: 'none', color: '#334155', fontWeight: 600, fontSize: '0.9rem' }}>
                    My Posts
                  </Link>
                </>
              )}

              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '9999px' }}>
                {user.role === 'admin' ? '🛡️ Admin' : `👋 ${user.name}`}
              </span>
              
              <button onClick={handleLogout} style={{ border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '8px', padding: '0.45rem 0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Logout">
                <LogOut size={16} color="#64748b" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>
                Student Login
              </Link>
              <Link to="/admin-login" style={{ textDecoration: 'none', color: '#7c3aed', fontWeight: 700, fontSize: '0.9rem' }}>
                Admin Portal
              </Link>
              <Link to="/register" style={{ textDecoration: 'none', background: '#4f46e5', color: '#ffffff', padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)' }}>
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}