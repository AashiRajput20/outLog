import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState({});

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get('/leave/all');
      setLeaves(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    try {
      await API.put(`/leave/update/${id}`, { status, remark: remark[id] || '' });
      fetchLeaves();
    } catch (err) { console.log(err); }
  };

  if (loading) return <p style={{ color: '#FFB3D1' }}>Loading...</p>;

  return (
    <div>
      {leaves.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ color: '#FFB3D1' }}>No special leave requests found.</p>
        </div>
      ) : (
        leaves.map((leave) => (
          <div key={leave._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.studentName}>{leave.student?.name}</span>
                <span style={styles.leaveType}> — {leave.leaveType.toUpperCase()}</span>
              </div>
              <span style={{
                ...styles.statusBadge,
                color: leave.status === 'approved' ? '#FF94B2' : leave.status === 'rejected' ? '#FF2D7A' : '#FFB3D1',
                border: `1px solid ${leave.status === 'approved' ? '#FF94B2' : leave.status === 'rejected' ? '#FF2D7A' : '#FFB3D1'}`,
                backgroundColor: '#1a0010',
              }}>
                {leave.status.toUpperCase()}
              </span>
            </div>

            <p style={styles.text}><span style={styles.label}>Roll No:</span> {leave.student?.rollNumber}</p>
            <p style={styles.text}><span style={styles.label}>Room:</span> {leave.student?.roomNumber} | <span style={styles.label}>Hostel:</span> {leave.student?.hostel}</p>
            <p style={styles.text}><span style={styles.label}>Reason:</span> {leave.reason}</p>
            <p style={styles.text}><span style={styles.label}>Destination:</span> {leave.destination}</p>
            <p style={styles.text}>
              <span style={styles.label}>Dates:</span>{' '}
              {new Date(leave.fromDate).toLocaleDateString()} → {new Date(leave.toDate).toLocaleDateString()}
            </p>
            {leave.wardenRemark && (
              <p style={styles.remark}>Warden: {leave.wardenRemark}</p>
            )}

            {(leave.status === 'pending' || leave.status === 'forwarded') && (
              <div style={styles.actionBox}>
                <input
                  style={styles.remarkInput}
                  placeholder='Add remark (optional)'
                  value={remark[leave._id] || ''}
                  onChange={(e) => setRemark({ ...remark, [leave._id]: e.target.value })}
                />
                <div style={styles.actionButtons}>
                  <button style={styles.approveBtn} onClick={() => handleAction(leave._id, 'approved')}>Approve</button>
                  <button style={styles.rejectBtn} onClick={() => handleAction(leave._id, 'rejected')}>Reject</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  emptyBox: {
    padding: '40px', textAlign: 'center',
    backgroundColor: '#2d0020', borderRadius: '16px', border: '1px solid #8B0050',
  },
  card: {
    backgroundColor: '#2d0020', padding: '16px 20px',
    borderRadius: '16px', border: '1px solid #8B0050', marginBottom: '12px',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px',
  },
  studentName: { fontWeight: 'bold', fontSize: '15px', color: '#FFE4F0' },
  leaveType: { fontSize: '13px', color: '#FF94B2', fontWeight: 'bold' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  text: { fontSize: '14px', color: '#FFB3D1', marginBottom: '4px' },
  label: { color: '#FFE4F0', fontWeight: 'bold' },
  remark: {
    fontSize: '13px', color: '#FF94B2', marginTop: '8px',
    padding: '8px 12px', backgroundColor: '#1a0010',
    borderRadius: '8px', borderLeft: '3px solid #FF2D7A',
  },
  actionBox: { marginTop: '12px', borderTop: '1px solid #8B0050', paddingTop: '12px' },
  remarkInput: {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid #8B0050', backgroundColor: '#1a0010',
    color: '#FFE4F0', fontSize: '14px', marginBottom: '10px',
    boxSizing: 'border-box', outline: 'none',
  },
  actionButtons: { display: 'flex', gap: '10px' },
  approveBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #FF2D7A, #FF94B2)',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold',
  },
  rejectBtn: {
    padding: '8px 20px', backgroundColor: '#1a0010',
    color: '#FF2D7A', border: '1px solid #FF2D7A',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
  },
};

export default AdminLeaves;