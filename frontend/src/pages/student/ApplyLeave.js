import React, { useState } from 'react';
import API from '../../utils/api';

function ApplyLeave() {
  const [formData, setFormData] = useState({
    leaveType: 'home',
    reason: '',
    destination: '',
    fromDate: '',
    toDate: '',
    parentContact: '',
    groupMembers: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const data = {
        ...formData,
        groupMembers: formData.groupMembers
          ? formData.groupMembers.split(',').map((m) => m.trim())
          : [],
      };
      await API.post('/leave/apply', data);
      setMessage('Leave applied successfully!');
      setFormData({
        leaveType: 'home', reason: '', destination: '',
        fromDate: '', toDate: '', parentContact: '', groupMembers: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply leave');
    }
    setLoading(false);
  };

  const leaveTypes = [
    { value: 'home', label: 'Home Leave' },
    { value: 'general', label: 'General Purpose' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'special', label: 'Special Leave' },
  ];

  return (
    <div style={styles.card}>
      {message && <div style={styles.successBox}>{message}</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.leaveTypeTabs}>
        {leaveTypes.map((type) => (
          <button
            key={type.value}
            type='button'
            style={formData.leaveType === type.value ? styles.leaveTypeActive : styles.leaveTypeBtn}
            onClick={() => setFormData({ ...formData, leaveType: type.value })}>
            {type.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Reason</label>
          <textarea
            style={{ ...styles.input, height: '90px', resize: 'vertical' }}
            name='reason' placeholder='Enter reason for leave'
            value={formData.reason} onChange={handleChange} required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Destination</label>
          <input style={styles.input} name='destination'
            placeholder='Where are you going?'
            value={formData.destination} onChange={handleChange} required />
        </div>
        <div style={styles.row}>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>From Date</label>
            <input style={styles.input} type='date' name='fromDate'
              value={formData.fromDate} onChange={handleChange} required />
          </div>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>To Date</label>
            <input style={styles.input} type='date' name='toDate'
              value={formData.toDate} onChange={handleChange} required />
          </div>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Parent Contact Number</label>
          <input style={styles.input} name='parentContact'
            placeholder='Parent mobile number'
            value={formData.parentContact} onChange={handleChange} required />
        </div>
        {formData.leaveType === 'general' && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Group Members (comma separated)</label>
            <input style={styles.input} name='groupMembers'
              placeholder='John, Jane, Bob'
              value={formData.groupMembers} onChange={handleChange} />
          </div>
        )}
        <button style={styles.button} type='submit' disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#2d0020', padding: '24px',
    borderRadius: '16px', border: '1px solid #8B0050',
  },
  leaveTypeTabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  leaveTypeBtn: {
    padding: '8px 16px', backgroundColor: '#1a0010',
    border: '1px solid #8B0050', borderRadius: '20px',
    color: '#FFB3D1', fontSize: '13px', cursor: 'pointer',
  },
  leaveTypeActive: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    border: 'none', borderRadius: '20px',
    color: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold',
  },
  inputGroup: { marginBottom: '16px' },
  label: {
    display: 'block', marginBottom: '8px',
    fontSize: '13px', color: '#FFB3D1', fontWeight: 'bold',
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid #8B0050', backgroundColor: '#1a0010',
    color: '#FFE4F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  row: { display: 'flex', gap: '16px' },
  button: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px',
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

export default ApplyLeave;