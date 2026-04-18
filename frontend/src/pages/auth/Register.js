import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNumber: '',
    roomNumber: '',
    hostel: '',
    parentContact: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <div style={styles.logoCircle}>H</div>
        </div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register to get started</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name='name' placeholder='Enter your full name' onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} name='email' type='email' placeholder='Enter your email' onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} name='password' type='password' placeholder='Create a password' onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input style={styles.input} name='phone' placeholder='Enter phone number' onChange={handleChange} />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select style={styles.input} name='role' onChange={handleChange} value={formData.role}>
              <option value='student'>Student</option>
              <option value='warden'>Warden</option>
              <option value='admin'>Admin</option>
              <option value='security'>Security</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div style={styles.row}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>Roll Number</label>
                  <input style={styles.input} name='rollNumber' placeholder='Roll number' onChange={handleChange} />
                </div>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>Room Number</label>
                  <input style={styles.input} name='roomNumber' placeholder='Room number' onChange={handleChange} />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Hostel Name</label>
                <input style={styles.input} name='hostel' placeholder='Enter hostel name' onChange={handleChange} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Parent Contact Number</label>
                <input style={styles.input} name='parentContact' placeholder='Parent mobile number' onChange={handleChange} />
              </div>
            </>
          )}

          <button style={styles.button} type='submit' disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account?{' '}
          <a href='/login' style={styles.link}>Sign in here</a>
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
  inputGroup: { marginBottom: '16px' },
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
  },
  row: { display: 'flex', gap: '12px' },
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

export default Register;