// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import HMlogo from '../assets/HMlogo.png';
import { FaShoppingCart } from 'react-icons/fa';

// src/components/Header.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/auth.context.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/cart.context.jsx';

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { cart } = useContext(CartContext); // Get cart from context
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setCurrentUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.left}>
        <img
          src={HMlogo}
          alt="HM Logo"
          style={styles.logo}
          onClick={() => navigate('/')}
          className="logo-clickable"
        />
      </div>
      {/* Search bar */}
      <div style={styles.center}>
        <form style={styles.searchBox} onSubmit={handleSearch}>
          <span style={styles.searchIcon}>&#128269;</span>
          <input
            type="text"
            placeholder="search"
            style={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" style={styles.micBtn}>
            <span role="img" aria-label="mic">🎤</span>
          </button>
        </form>
      </div>
      {/* Cart, User */}
      <div style={styles.right}>
        <span
          style={styles.cartIcon}
          title="Cart"
          onClick={() => navigate('/cart')}
        >
          <FaShoppingCart />
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: 8,
              right: 18,
              background: '#d32f2f',
              color: '#fff',
              borderRadius: '50%',
              fontSize: 13,
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}>
              {cart.length}
            </span>
          )}
        </span>
        <span style={styles.userIcon} title="User">&#128100;</span>
        {currentUser ? (
          <>
            <span style={styles.userName}>{currentUser.name}</span>
            <button
              onClick={handleLogout}
              style={styles.loginBtn}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <button
            style={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

const styles = {
  header: {
    width: '100%',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    borderBottom: '2px solid #e5c49b',
    padding: '0 32px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 10,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 80,
  },
  logo: {
    height: 38,
    width: 38,
    objectFit: 'contain',
    marginRight: 8,
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #ccc',
    borderRadius: 8,
    background: '#fff',
    padding: '0 8px',
    minWidth: 220,
    maxWidth: 320,
    width: '100%',
    height: 36,
  },
  searchIcon: {
    fontSize: 18,
    color: '#888',
    marginRight: 4,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 16,
    flex: 1,
    background: 'transparent',
    color: '#333',
    padding: '0 4px',
  },
  micBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    marginLeft: 4,
    color: '#888',
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 180,
    justifyContent: 'flex-end',
  },
  cartIcon: {
    fontSize: 26,
    marginRight: 10,
    cursor: 'pointer',
    position: 'relative',
    color: '#8d6748', // Add your desired color here
  },
  userIcon: {
    fontSize: 26,
    marginRight: 6,
    cursor: 'pointer',
  },
  userName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 500,
    marginRight: 8,
  },
  loginBtn: {
    background: '#e5c49b',
    border: 'none',
    borderRadius: 6,
    color: '#222',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
    padding: '6px 18px',
    fontSize: 15,
    marginLeft: 4,
  },
};
