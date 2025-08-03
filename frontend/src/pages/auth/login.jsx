// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
import HMlogo from '../../assets/HMlogo.png';

const mainColor = '#e5c49b';

// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth.context.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form, {
        withCredentials: true,
      });
      setCurrentUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại';
      setError(msg);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.loginBox} onSubmit={handleSubmit}>
        <img src={HMlogo} alt="HM Logo" style={styles.logo} />
        <div style={styles.loginTitle}>Đăng nhập</div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="username"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            style={styles.input}
          />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.loginBtn}>Đăng nhập</button>
        <div style={styles.registerLink}>
          Bạn chưa có tài khoản? <a href="/register" style={styles.link}>Đăng ký</a>
        </div>
      </form>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    background: 'linear-gradient(to bottom, rgb(99, 169, 204), #f1e5af)',
    minHeight: '100vh',
    minWidth: '100vw',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  loginBox: {
    background: mainColor,
    border: '2px solid #eee',
    borderRadius: 6,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '40px 32px 24px 32px',
    minWidth: 340,
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100
  },
  loginTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  formGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontSize: '1rem',
    color: '#111',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #ccc',
    borderRadius: 6,
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 0,
    background: 'rgb(220, 206, 206)',
    color: '#111',
  },
  loginBtn: {
    width: 'fit-content',
    minWidth: 120,
    padding: '10px 32px',
    background: '#8d6748',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: '1.1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
    boxShadow: '1px 2px 0 #bbb',
    margin: '12px auto 0 auto',
    display: 'block',
  },
  registerLink: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: '1rem',
    color: '#111',
  },
  link: {
    color: '#111',
    textDecoration: 'underline',
    fontWeight: 500,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: '0.95rem',
    textAlign: 'center',
  },
};
