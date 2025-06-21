import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CourseInstanceViewer({ onBack }) {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInstances = () => {
    if (!year || !semester) return;
    setLoading(true);
    axios.get(`http://localhost:8081/api/instances/${year}/${semester}`)
      .then(res => setInstances(res.data))
      .catch(() => alert('Error fetching course instances'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>

        <h2 style={styles.title}>View Course Instances</h2>

        <div style={styles.controls}>
          <select value={year} onChange={e => setYear(e.target.value)} style={styles.select}>
            <option value="">Select Year</option>
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select value={semester} onChange={e => setSemester(e.target.value)} style={styles.select}>
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          <button onClick={fetchInstances} style={styles.primaryBtn}>🔍 View</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : instances.length === 0 ? (
          <p style={{ color: '#666', marginTop: '2rem' }}>No course instances found.</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course ID</th>
                  <th style={styles.th}>Title</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((inst, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{inst.course.courseId}</td>
                    <td style={styles.td}>{inst.course.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    minHeight: '100vh',
    background: '#f7f9fa',
    padding: '3rem 1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    width: '95%',
    maxWidth: '720px',
    background: '#fff',
    borderRadius: '10px',
    padding: '2.5rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: '1.8rem',
    color: '#002366',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minWidth: '150px',
  },
  primaryBtn: {
    background: '#002366',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.5rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  backBtn: {
    background: '#002366',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.4rem 1rem',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  th: {
    background: '#002366',
    color: '#fff',
    padding: '0.75rem',
    textAlign: 'left',
    fontWeight: 600,
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee',
  },
};
