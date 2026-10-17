import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          🔍 FoundIt
        </Link>
        <div className="nav-links">
          <Link to="/">Board</Link>
          {user ? (
            <>
              <Link to="/post" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>
                <PlusCircle size={16} /> Post Item
              </Link>
              <Link to="/my-posts">My Posts</Link>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.7rem' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}