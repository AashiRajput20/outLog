import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === 'student') navigate('/student');
      else if (role === 'warden') navigate('/warden');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'security') navigate('/security');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <div style={styles.logoCircle}>H</div>
        </div>
        <h2 style={styles.title}>Hostel Management</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type='submit' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.bottomText}>
          Don't have an account?{' '}
          <a href='/register' style={styles.link}>Register here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a0010',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#2d0020',
    padding: '40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #8B0050',
    boxShadow: '0 0 40px rgba(255, 45, 122, 0.15)',
  },
  logoBox: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logoCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#FFE4F0',
    fontSize: '22px',
    marginBottom: '6px',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#FFB3D1',
    fontSize: '14px',
    marginBottom: '28px',
  },
  inputGroup: { marginBottom: '18px' },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    color: '#FFB3D1',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #8B0050',
    backgroundColor: '#1a0010',
    color: '#FFE4F0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
    letterSpacing: '0.5px',
  },
  errorBox: {
    backgroundColor: '#3d0015',
    border: '1px solid #FF2D7A',
    color: '#FF94B2',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  bottomText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#FFB3D1',
  },
  link: {
    color: '#FF94B2',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;