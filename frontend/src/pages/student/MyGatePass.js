import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

function MyGatePass() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const res = await API.get('/leave/my-gatepass');
        setPasses(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchPasses();
  }, []);

  const getStatusStyle = (status) => {
    if (status === 'active') return { color: '#FF94B2', border: '1px solid #FF94B2', backgroundColor: '#3d0020' };
    if (status === 'exited') return { color: '#FFB3D1', border: '1px solid #FFB3D1', backgroundColor: '#2d0020' };
    if (status === 'returned') return { color: '#FF2D7A', border: '1px solid #FF2D7A', backgroundColor: '#3d0015' };
    if (status === 'expired') return { color: '#8B0050', border: '1px solid #8B0050', backgroundColor: '#1a0010' };
    return {};
  };

  if (loading) return <p style={{ color: '#FFB3D1' }}>Loading...</p>;

  return (
    <div>
      {passes.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ color: '#FFB3D1' }}>No gate passes found.</p>
        </div>
      ) : (
        passes.map((pass) => (
          <div key={pass._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.passNumber}>{pass.passNumber}</span>
              <span style={{ ...styles.statusBadge, ...getStatusStyle(pass.status) }}>
                {pass.status.toUpperCase()}
              </span>
            </div>
            {pass.qrCode && (
              <div style={styles.qrBox}>
                <img src={pass.qrCode} alt='QR Code' style={styles.qr} />
                <p style={styles.qrText}>Show this at the gate</p>
              </div>
            )}
            {pass.exitTime && (
              <p style={styles.text}><span style={styles.textLabel}>Exit:</span> {new Date(pass.exitTime).toLocaleString()}</p>
            )}
            {pass.returnTime && (
              <p style={styles.text}><span style={styles.textLabel}>Return:</span> {new Date(pass.returnTime).toLocaleString()}</p>
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
    backgroundColor: '#2d0020', padding: '20px',
    borderRadius: '16px', border: '1px solid #8B0050', marginBottom: '12px',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  passNumber: { fontWeight: 'bold', color: '#FF94B2', fontSize: '15px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  qrBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px', backgroundColor: '#1a0010',
    borderRadius: '12px', marginBottom: '12px', border: '1px solid #8B0050',
  },
  qr: { width: '160px', height: '160px', borderRadius: '8px' },
  qrText: { fontSize: '12px', color: '#FFB3D1', marginTop: '10px' },
  text: { fontSize: '14px', color: '#FFB3D1', marginBottom: '4px' },
  textLabel: { color: '#FFE4F0', fontWeight: 'bold' },
};

export default MyGatePass;