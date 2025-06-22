import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoursesTable = ({ onBack, editable = false }) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [addForm, setAddForm] = useState({
    title: '',
    courseId: '',
    description: '',
    academicYear: '',
    semester: '',
    prerequisiteIds: [],
  });

  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const [deletePending, setDeletePending] = useState(null);
  const [deleteConflictMessage, setDeleteConflictMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const prereqIdsOf = (course) =>
    course.prerequisiteIds ??
    (course.prerequisites
      ? course.prerequisites.map(p => p.courseId ?? p)
      : []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    axios.get('http://localhost:8081/api/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err))
      .finally(() => setLoading(false));
  };

  const visibleCourses = courses
    .filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const [field, dir] = sortOption.split('-');
      return dir === 'asc'
        ? a[field].localeCompare(b[field])
        : b[field].localeCompare(a[field]);
    });

  const handleDelete = (course) => {
    axios
      .delete(`http://localhost:8081/api/courses/${course.courseId}`)
      .then(() => fetchCourses())
      .catch(err => {
        const { status, data } = err.response || {};
        if (status === 409 && Array.isArray(data)) {
          const message = `This course has been offered in ${data.join(', ')}. Deleting it will remove the course from those offerings as well. Do you want to proceed?`;
          setDeleteConflictMessage(message);
          setDeletePending(course);
          setShowDeleteModal(true);
        } else if (status === 409) {
          setDeleteConflictMessage(data);
          setShowDeleteModal(true);
        } else {
          setDeleteConflictMessage('Server error while deleting course.');
          setShowDeleteModal(true);
        }
      });
  };

  const confirmForceDelete = () => {
    if (!deletePending) return;
    axios
      .delete(`http://localhost:8081/api/courses/${deletePending.courseId}?force=true`)
      .then(() => {
        fetchCourses();
        setDeletePending(null);
        setShowDeleteModal(false);
      })
      .catch(() => {
        setDeleteConflictMessage('Server error while force-deleting.');
      });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');

    const url = editMode
      ? `http://localhost:8081/api/courses/${editingCourseId}`
      : 'http://localhost:8081/api/courses';

    const method = editMode ? axios.put : axios.post;

    method(url, addForm)
      .then(() => {
        setShowAddModal(false);
        setAddForm({ title: '', courseId: '', description: '', academicYear: '', semester: '', prerequisiteIds: [] });
        setEditMode(false);
        setEditingCourseId(null);
        fetchCourses();
      })
      .catch(() => {
        setAddError(editMode ? 'Error updating course.' : 'Error adding course.');
      })
      .finally(() => setAddLoading(false));
  };

  return (
    <div style={{ padding: '3rem', background: '#f7f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <button style={{ background: '#002366', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', marginBottom: '1rem' }} onClick={onBack}>
          ← Back
        </button>

        <h2 style={{ textAlign: 'center', color: '#002366' }}>All Courses</h2>

        {editable && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <button onClick={() => {
              setEditMode(false);
              setAddForm({ title: '', courseId: '', description: '', academicYear: '', semester: '', prerequisiteIds: [] });
              setShowAddModal(true);
            }} style={{
              background: '#002366',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}>
              + Add Course
            </button>
          </div>
        )}

        <input
          style={{ padding: '0.5rem', width: '300px', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
          placeholder="Search…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          style={{ marginLeft: '1rem', padding: '0.5rem' }}
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
        >
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
          <option value="courseId-asc">Course ID (A–Z)</option>
          <option value="courseId-desc">Course ID (Z–A)</option>
        </select>

        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#002366', color: 'white' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Course ID</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Prerequisites</th>
              {editable && <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {visibleCourses.map(course => {
              const isPrereqForOthers = courses.some(c => prereqIdsOf(c).includes(course.courseId));
              return (
                <tr key={course.courseId}>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{course.title}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{course.courseId}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{course.description}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                    {course.prerequisites?.length > 0
                      ? course.prerequisites.map(p => p.title).join(', ')
                      : '—'}
                  </td>
                  {editable && (
                    <td style={{ textAlign: 'center', padding: '0.75rem', borderBottom: '1px solid #eee' }}>
                      <button
                        title="Edit"
                        style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}
                        onClick={() => {
                          setEditMode(true);
                          setEditingCourseId(course.courseId);
                          setAddForm({
                            title: course.title,
                            courseId: course.courseId,
                            description: course.description,
                            academicYear: course.academicYear,
                            semester: course.semester,
                            prerequisiteIds: prereqIdsOf(course),
                          });
                          setShowAddModal(true);
                        }}
                      >✏️</button>
                      <button
                        title={isPrereqForOthers ? 'Cannot delete: course is a prerequisite for other courses.' : 'Delete'}
                        disabled={isPrereqForOthers}
                        style={{
                          fontSize: '1.1rem',
                          opacity: isPrereqForOthers ? 0.4 : 1,
                          cursor: isPrereqForOthers ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => !isPrereqForOthers && handleDelete(course)}
                      >🗑️</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999
        }}>
          <form onSubmit={handleAddCourse} style={{
            background: '#fff', padding: '2rem', borderRadius: '10px',
            minWidth: '400px', maxWidth: '90vw', boxShadow: '0 0 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#002366' }}>
              {editMode ? 'Edit Course' : 'Add New Course'}
            </h3>
            <input required placeholder="Title" style={modalInputStyle} value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
            <input required placeholder="Course ID" style={modalInputStyle} value={addForm.courseId} disabled={editMode} onChange={e => setAddForm(f => ({ ...f, courseId: e.target.value }))} />
            <input required type="number" placeholder="Year" style={modalInputStyle} value={addForm.academicYear} onChange={e => setAddForm(f => ({ ...f, academicYear: e.target.value }))} />
            <select required style={modalInputStyle} value={addForm.semester} onChange={e => setAddForm(f => ({ ...f, semester: e.target.value }))}>
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
              ))}
            </select>
            <select multiple style={modalInputStyle} value={addForm.prerequisiteIds} onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(o => o.value);
              setAddForm(f => ({ ...f, prerequisiteIds: selected.filter(x => x !== '-') }));
            }}>
              <option value="-">None</option>
              {courses.map(c => (
                <option key={c.courseId} value={c.courseId}>{c.title} ({c.courseId})</option>
              ))}
            </select>
            <textarea required placeholder="Description" style={modalInputStyle} value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
            {addError && <div style={{ color: 'red', marginBottom: '1rem' }}>{addError}</div>}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button type="button" style={{ marginRight: '1rem' }} onClick={() => {
                setShowAddModal(false);
                setEditMode(false);
                setEditingCourseId(null);
              }}>Cancel</button>
              <button type="submit" style={{ background: '#002366', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px' }}>
                {addLoading ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? 'Update' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'white', padding: '2rem', borderRadius: '10px',
            maxWidth: '500px', boxShadow: '0 0 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#002366' }}>Delete Course</h3>
            <p>{deleteConflictMessage}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              {deletePending && (
                <button onClick={confirmForceDelete} style={{ background: '#002366', color: '#fff', padding: '0.5rem 1rem', borderRadius: '5px', border: 'none' }}>Delete Anyway</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalInputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

export default CoursesTable;
