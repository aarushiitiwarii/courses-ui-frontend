import { useEffect, useState } from 'react';
import { getCourses, createCourse } from './api';

export default function CreateCourseForm() {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCourses().then(setAllCourses);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      courseId,
      description,
      academicYear,
      semester,
      prerequisiteIds: selectedPrereqs,
    };

    try {
      await createCourse(payload);
      setMessage('✅ Course created successfully!');
      setTitle('');
      setCourseId('');
      setDescription('');
      setAcademicYear('');
      setSemester('');
      setSelectedPrereqs([]);
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-course-form">
      <h2>Create New Course</h2>
      <label>
        Title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Course ID:
        <input value={courseId} onChange={(e) => setCourseId(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Academic Year:
        <input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required />
      </label>
      <label>
        Semester:
        <input value={semester} onChange={(e) => setSemester(e.target.value)} required />
      </label>

      <label>
        Prerequisites:
        <select
          multiple
          value={selectedPrereqs}
          onChange={(e) =>
            setSelectedPrereqs(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
        >
          {allCourses.map((c) => (
            <option key={c.id} value={c.courseId}>
              {c.courseId} — {c.title}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Create Course</button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </form>
  );
}
