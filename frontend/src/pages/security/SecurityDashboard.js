import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

function SecurityDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passNumber, setPassNumber] = useState('');
  const [gatePass, setGatePass] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    setGatePass(null);
    try {
      const res = await API.post('/security/verify', { passNumber });
      setGatePass(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid pass number');
    }
    setLoading(false);
  };

  const handleMarkExit = async () => {
    try {
      const res = await API.post('/security/mark-exit', { passNumber });
      setMessage(res.data.message);
      handleVerify();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark exit');
    }
  };

  const handleMarkReturn = async () => {
    try {
      const res = await API.post('/security/mark-return', { passNumber });
      setMessage(res.data.message);
      handleVerify();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark return');
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'active') return { color: '#FF94B2', border: '1px solid #FF94B2', backgroundColor: '#3d0020' };
    if (status === 'exited') return { color: '#FFB3D1', border: '1px solid #FFB3D1', backgroundColor: '#2d0020' };
    if (status === 'returned') return { color: '#FF2D7A', border: '1px solid #FF2D7A', backgroundColor: '#3d0015' };
    if (status === 'expired') return { color: '#8B0050', border: '1px solid #8B0050', backgroundColor: '#1a0010' };
    return {};
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logoBox}>
          <div style={styles.logoCircle}>H</div>
          <span style={styles.logoText}>HostelLog</span>
        </div>
        <div style={styles.userBox}>
          <div style={styles.userAvatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p style={styles.userName}>{user?.name}</p>
            <p style={styles.userRole}>Security</p>
          </div>
        </div>
        <nav style={styles.nav}>
          <button style={styles.navItemActive}>Verify Gate Pass</button>
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <h2 style={styles.pageTitle}>Verify Gate Pass</h2>
        </div>
        <div style={styles.content}>
          <div style={styles.card}>
            <div style={styles.searchBox}>
              <input
                style={styles.input}
                placeholder='Enter Pass Number (e.g. PASS-123456-789)'
                value={passNumber}
                onChange={(e) => setPassNumber(e.target.value)}
              />
              <button style={styles.verifyBtn} onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{error}</div>}

            {gatePass && (
              <div style={styles.passCard}>
                <div style={styles.passHeader}>
                  <span style={styles.passNumber}>{gatePass.passNumber}</span>
                  <span style={{ ...styles.statusBadge, ...getStatusStyle(gatePass.status) }}>
                    {gatePass.status.toUpperCase()}
                  </span>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Student Name</span>
                    <span style={styles.infoValue}>{gatePass.student?.name}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Roll Number</span>
                    <span style={styles.infoValue}>{gatePass.student?.rollNumber}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Room</span>
                    <span style={styles.infoValue}>{gatePass.student?.roomNumber}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Hostel</span>
                    <span style={styles.infoValue}>{gatePass.student?.hostel}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Leave Type</span>
                    <span style={styles.infoValue}>{gatePass.leaveRequest?.leaveType?.toUpperCase()}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Destination</span>
                    <span style={styles.infoValue}>{gatePass.leaveRequest?.destination}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>From</span>
                    <span style={styles.infoValue}>{new Date(gatePass.leaveRequest?.fromDate).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>To</span>
                    <span style={styles.infoValue}>{new Date(gatePass.leaveRequest?.toDate).toLocaleDateString()}</span>
                  </div>
                  {gatePass.exitTime && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Exit Time</span>
                      <span style={styles.infoValue}>{new Date(gatePass.exitTime).toLocaleString()}</span>
                    </div>
                  )}
                  {gatePass.returnTime && (
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Return Time</span>
                      <span style={styles.infoValue}>{new Date(gatePass.returnTime).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div style={styles.actionButtons}>
                  {gatePass.status === 'active' && (
                    <button style={styles.exitBtn} onClick={handleMarkExit}>Mark Exit</button>
                  )}
                  {gatePass.status === 'exited' && (
                    <button style={styles.returnBtn} onClick={handleMarkReturn}>Mark Return</button>
                  )}
                  {gatePass.status === 'returned' && (
                    <p style={{ color: '#FF94B2', fontWeight: 'bold' }}>Student has returned successfully</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1a0010' },
  sidebar: {
    width: '240px', backgroundColor: '#2d0020',
    borderRight: '1px solid #8B0050', display: 'flex',
    flexDirection: 'column', padding: '24px 16px',
    position: 'fixed', height: '100vh', top: 0, left: 0,
  },
  logoBox: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' },
  logoCircle: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: 'bold', color: '#fff',
  },
  logoText: { color: '#FFE4F0', fontSize: '18px', fontWeight: 'bold' },
  userBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px', backgroundColor: '#1a0010',
    borderRadius: '10px', marginBottom: '24px', border: '1px solid #8B0050',
  },
  userAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: 'bold', color: '#fff',
  },
  userName: { color: '#FFE4F0', fontSize: '14px', fontWeight: 'bold', margin: 0 },
  userRole: { color: '#FFB3D1', fontSize: '12px', margin: 0 },
  nav: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  navItemActive: {
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '14px', cursor: 'pointer',
    textAlign: 'left', fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '12px 16px', backgroundColor: 'transparent',
    border: '1px solid #8B0050', borderRadius: '10px',
    color: '#FFB3D1', fontSize: '14px', cursor: 'pointer',
    textAlign: 'left', marginTop: '16px',
  },
  main: { flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' },
  topBar: { padding: '20px 28px', borderBottom: '1px solid #8B0050', backgroundColor: '#2d0020' },
  pageTitle: { color: '#FFE4F0', margin: 0, fontSize: '20px' },
  content: { padding: '28px', flex: 1 },
  card: {
    backgroundColor: '#2d0020', padding: '24px',
    borderRadius: '16px', border: '1px solid #8B0050',
  },
  searchBox: { display: 'flex', gap: '12px', marginBottom: '16px' },
  input: {
    flex: 1, padding: '12px 16px', borderRadius: '10px',
    border: '1px solid #8B0050', backgroundColor: '#1a0010',
    color: '#FFE4F0', fontSize: '14px', outline: 'none',
  },
  verifyBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    color: '#fff', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
  },
  passCard: {
    marginTop: '16px', padding: '20px', borderRadius: '12px',
    border: '1px solid #8B0050', backgroundColor: '#1a0010',
  },
  passHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  passNumber: { fontWeight: 'bold', color: '#FF94B2', fontSize: '16px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '12px', marginBottom: '16px',
  },
  infoItem: {
    display: 'flex', flexDirection: 'column', gap: '4px',
    padding: '10px 14px', backgroundColor: '#2d0020',
    borderRadius: '10px', border: '1px solid #8B0050',
  },
  infoLabel: { fontSize: '11px', color: '#FFB3D1', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '14px', color: '#FFE4F0', fontWeight: 'bold' },
  actionButtons: { display: 'flex', gap: '12px', marginTop: '8px' },
  exitBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    color: '#fff', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
  },
  returnBtn: {
    padding: '12px 28px', backgroundColor: '#1a0010',
    color: '#FF94B2', border: '1px solid #FF94B2',
    borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
  },
  successBox: {
    backgroundColor: '#1a0020', border: '1px solid #FF94B2',
    color: '#FF94B2', padding: '10px 14px',
    borderRadius: '10px', fontSize: '13px', marginBottom: '16px',
  },
  errorBox: {
    backgroundColor: '#3d0015', border: '1px solid #FF2D7A',
    color: '#FF94B2', padding: '10px 14px',
    borderRadius: '10px', fontSize: '13px', marginBottom: '16px',
  },
};

export default SecurityDashboard;