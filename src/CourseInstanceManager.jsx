import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CourseInstanceManager({ onBack }) {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [courseId, setCourseId] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/api/courses')
      .then(res => setAllCourses(res.data))
      .catch(() => alert('Error loading courses'));
  }, []);

  const fetchInstances = () => {
    if (!year || !semester) return;
    axios.get(`http://localhost:8081/api/instances/${year}/${semester}`)
      .then(res => setInstances(res.data))
      .catch(() => alert('Error loading instances'));
  };

  const handleAdd = () => {
    if (!year || !semester || !courseId) return;
    setMessage('');
    axios.post('http://localhost:8081/api/instances', {
      academicYear: parseInt(year),
      semester: parseInt(semester),
      courseId: courseId
    })
      .then(() => {
        setCourseId('');
        fetchInstances();
        setMessage('✅ Course instance added successfully.');
      })
      .catch(err => {
        if (err.response?.status === 409) {
          setMessage('⚠️ Instance already exists.');
        } else {
          setMessage('❌ Error adding instance.');
        }
      });
  };

  const handleDelete = (instance) => {
    const { academicYear, semester, course } = instance;
    const url = `http://localhost:8081/api/instances/${academicYear}/${semester}/${course.courseId}`;
    axios.delete(url)
      .then(fetchInstances)
      .catch(() => alert('Error deleting instance'));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={onBack} style={styles.backBtn}>← Back</button>

        <h2 style={styles.title}>Edit Course Delivery Instances</h2>

        <div style={styles.formRow}>
          <select value={year} onChange={e => setYear(e.target.value)} style={styles.select}>
            <option value="">Select Year</option>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={semester} onChange={e => setSemester(e.target.value)} style={styles.select}>
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>

          <button onClick={fetchInstances} style={styles.primaryBtn}>📄 Load</button>
        </div>

        {year && semester && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 500 }}>Add Instance:</label>
            <div style={styles.formRow}>
              <select value={courseId} onChange={e => setCourseId(e.target.value)} style={styles.select}>
                <option value="">Select Course</option>
                {allCourses.map(c => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.title} ({c.courseId})
                  </option>
                ))}
              </select>
              <button onClick={handleAdd} style={styles.primaryBtn}>➕ Add</button>
            </div>
            {message && <div style={{ marginTop: '0.5rem', color: '#333' }}>{message}</div>}
          </div>
        )}

        {instances.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Course ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instances.map((inst, i) => (
                <tr key={i}>
                  <td style={styles.td}>{inst.course.courseId}</td>
                  <td style={styles.td}>{inst.course.title}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(inst)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
    justifyContent: 'center',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minWidth: '160px',
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
    marginTop: '1rem',
  },
  th: {
    background: '#002366',
    color: '#fff',
    padding: '0.75rem',
    textAlign: 'left',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #eee',
  },
  deleteBtn: {
    background: '#d11a2a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
  },
};
