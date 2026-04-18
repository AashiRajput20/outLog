import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await API.get('/leave/my');
        setLeaves(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchLeaves();
  }, []);

  const getStatusStyle = (status) => {
    if (status === 'approved') return { color: '#FF94B2', border: '1px solid #FF94B2', backgroundColor: '#3d0020' };
    if (status === 'rejected') return { color: '#FF2D7A', border: '1px solid #FF2D7A', backgroundColor: '#3d0015' };
    if (status === 'forwarded') return { color: '#FFB3D1', border: '1px solid #FFB3D1', backgroundColor: '#2d0020' };
    return { color: '#FFE4F0', border: '1px solid #8B0050', backgroundColor: '#1a0010' };
  };

  if (loading) return <p style={{ color: '#FFB3D1' }}>Loading...</p>;

  return (
    <div>
      {leaves.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ color: '#FFB3D1' }}>No leave applications found.</p>
        </div>
      ) : (
        leaves.map((leave) => (
          <div key={leave._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.leaveTypeBadge}>{leave.leaveType.toUpperCase()}</span>
              <span style={{ ...styles.statusBadge, ...getStatusStyle(leave.status) }}>
                {leave.status.toUpperCase()}
              </span>
            </div>
            <p style={styles.text}><span style={styles.textLabel}>Reason:</span> {leave.reason}</p>
            <p style={styles.text}><span style={styles.textLabel}>Destination:</span> {leave.destination}</p>
            <p style={styles.text}>
              <span style={styles.textLabel}>Dates:</span>{' '}
              {new Date(leave.fromDate).toLocaleDateString()} → {new Date(leave.toDate).toLocaleDateString()}
            </p>
            {leave.wardenRemark && (
              <p style={styles.remark}>Warden: {leave.wardenRemark}</p>
            )}
            {leave.adminRemark && (
              <p style={styles.remark}>Admin: {leave.adminRemark}</p>
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
  leaveTypeBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
    fontWeight: 'bold', backgroundColor: '#3d0020',
    color: '#FF94B2', border: '1px solid #FF2D7A',
  },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  text: { fontSize: '14px', color: '#FFB3D1', marginBottom: '6px' },
  textLabel: { color: '#FFE4F0', fontWeight: 'bold' },
  remark: {
    fontSize: '13px', color: '#FF94B2', marginTop: '8px',
    padding: '8px 12px', backgroundColor: '#1a0010',
    borderRadius: '8px', borderLeft: '3px solid #FF2D7A',
  },
};

export default MyLeaves;