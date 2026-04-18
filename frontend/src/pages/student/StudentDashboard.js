import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApplyLeave from './ApplyLeave';
import MyLeaves from './MyLeaves';
import MyGatePass from './MyGatePass';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('apply');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { key: 'apply', label: 'Apply Leave' },
    { key: 'myleaves', label: 'My Leaves' },
    { key: 'gatepass', label: 'My Gate Pass' },
  ];

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
            <p style={styles.userRole}>Student</p>
          </div>
        </div>
        <nav style={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              style={activeTab === tab.key ? styles.navItemActive : styles.navItem}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <h2 style={styles.pageTitle}>{tabs.find(t => t.key === activeTab)?.label}</h2>
        </div>
        <div style={styles.content}>
          {activeTab === 'apply' && <ApplyLeave />}
          {activeTab === 'myleaves' && <MyLeaves />}
          {activeTab === 'gatepass' && <MyGatePass />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1a0010' },
  sidebar: {
    width: '240px',
    backgroundColor: '#2d0020',
    borderRight: '1px solid #8B0050',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'fixed',
    height: '100vh',
    top: 0,
    left: 0,
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
    borderRadius: '10px', marginBottom: '24px',
    border: '1px solid #8B0050',
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
  navItem: {
    padding: '12px 16px', backgroundColor: 'transparent',
    border: 'none', borderRadius: '10px',
    color: '#FFB3D1', fontSize: '14px', cursor: 'pointer', textAlign: 'left',
  },
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
  topBar: {
    padding: '20px 28px', borderBottom: '1px solid #8B0050',
    backgroundColor: '#2d0020',
  },
  pageTitle: { color: '#FFE4F0', margin: 0, fontSize: '20px' },
  content: { padding: '28px', flex: 1 },
};

export default StudentDashboard;