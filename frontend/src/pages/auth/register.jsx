import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import HMlogo from '../../assets/HMlogo.png';

const mainColor = '#e5c49b';
const mainColorDark = '#bfa06e';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Add this line

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Optionally show success or auto-login
        navigate('/login');
      } else {
        setError(data.message || 'Đăng ký thất bại.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.loginBox} onSubmit={handleSubmit}>
        <img src={HMlogo} alt="HM Logo" style={styles.logo} />
        <div style={styles.loginTitle}>Đăng ký</div>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Họ tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoComplete="name"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            style={styles.input}
          />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.loginBtn}>Đăng ký</button>
        <div style={styles.registerLink}>
          Đã có tài khoản? <a href="/login" style={styles.link}>Đăng nhập</a>
        </div>
      </form>
    </div>
  );
}

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
