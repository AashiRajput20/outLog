import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

function AllLeaves() {
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

  const handleAction = async (id, action) => {
    try {
      await API.put(`/leave/warden-action/${id}`, {
        action,
        remark: remark[id] || '',
      });
      fetchLeaves();
    } catch (err) { console.log(err); }
  };

  const getStatusBadge = (leave) => {
    if (leave.status === 'approved') return { label: 'APPROVED', color: '#FF94B2', border: '1px solid #FF94B2', bg: '#3d0020' };
    if (leave.status === 'rejected') return { label: 'REJECTED', color: '#FF2D7A', border: '1px solid #FF2D7A', bg: '#3d0015' };
    if (leave.status === 'forwarded_to_admin') return { label: 'FORWARDED TO ADMIN', color: '#FFB3D1', border: '1px solid #FFB3D1', bg: '#2d0020' };
    return { label: 'PENDING', color: '#FFE4F0', border: '1px solid #8B0050', bg: '#1a0010' };
  };

  // Warden can act if:
  // 1. Fresh request (wardenStatus === 'pending' and not forwarded)
  // 2. Was forwarded and admin has responded (adminStatus is 'approved' or 'rejected')
  const wardenCanAct = (leave) => {
    if (leave.wardenStatus === 'pending' && !leave.forwardedToAdmin) return true;
    if (leave.forwardedToAdmin && leave.adminStatus !== 'pending') return true;
    return false;
  };

  if (loading) return <p style={{ color: '#FFB3D1' }}>Loading...</p>;

  return (
    <div>
      {leaves.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ color: '#FFB3D1' }}>No leave requests found.</p>
        </div>
      ) : (
        leaves.map((leave) => {
          const badge = getStatusBadge(leave);
          return (
            <div key={leave._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.studentName}>{leave.student?.name}</span>
                  <span style={styles.leaveType}> — {leave.leaveType.toUpperCase()}</span>
                </div>
                <span style={{ ...styles.statusBadge, color: badge.color, border: badge.border, backgroundColor: badge.bg }}>
                  {badge.label}
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
              <p style={styles.text}><span style={styles.label}>Parent Contact:</span> {leave.parentContact}</p>

              {/* Show admin's decision to warden if forwarded */}
              {leave.forwardedToAdmin && (
                <div style={{
                  ...styles.adminDecisionBox,
                  borderColor: leave.adminStatus === 'approved' ? '#FF94B2' : leave.adminStatus === 'rejected' ? '#FF2D7A' : '#8B0050'
                }}>
                  {leave.adminStatus === 'pending' && (
                    <p style={{ color: '#FFB3D1', margin: 0, fontSize: '13px' }}>
                      ⏳ Waiting for admin decision...
                    </p>
                  )}
                  {leave.adminStatus === 'approved' && (
                    <p style={{ color: '#FF94B2', margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
                      ✅ Approved by Admin {leave.adminRemark ? `— "${leave.adminRemark}"` : ''}
                    </p>
                  )}
                  {leave.adminStatus === 'rejected' && (
                    <p style={{ color: '#FF2D7A', margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
                      ❌ Rejected by Admin {leave.adminRemark ? `— "${leave.adminRemark}"` : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Warden action buttons */}
              {wardenCanAct(leave) && (
                <div style={styles.actionBox}>
                  <input
                    style={styles.remarkInput}
                    placeholder='Add remark (optional)'
                    value={remark[leave._id] || ''}
                    onChange={(e) => setRemark({ ...remark, [leave._id]: e.target.value })}
                  />
                  <div style={styles.actionButtons}>
                    <button style={styles.approveBtn} onClick={() => handleAction(leave._id, 'approve')}>
                      Approve
                    </button>
                    <button style={styles.rejectBtn} onClick={() => handleAction(leave._id, 'reject')}>
                      Reject
                    </button>
                    {/* Forward button only for non-forwarded pending requests */}
                    {!leave.forwardedToAdmin && (
                      <button style={styles.forwardBtn} onClick={() => handleAction(leave._id, 'forward')}>
                        Forward to Admin
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
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
  adminDecisionBox: {
    marginTop: '10px', padding: '10px 14px',
    backgroundColor: '#1a0010', borderRadius: '8px',
    borderLeft: '3px solid #8B0050',
  },
  actionBox: { marginTop: '12px', borderTop: '1px solid #8B0050', paddingTop: '12px' },
  remarkInput: {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid #8B0050', backgroundColor: '#1a0010',
    color: '#FFE4F0', fontSize: '14px', marginBottom: '10px',
    boxSizing: 'border-box', outline: 'none',
  },
  actionButtons: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
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
  forwardBtn: {
    padding: '8px 20px', backgroundColor: '#1a0010',
    color: '#FFB3D1', border: '1px solid #FFB3D1',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
  },
};

export default AllLeaves;