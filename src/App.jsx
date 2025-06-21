import { useEffect, useState } from 'react';
import axios from 'axios';
import MainCoursePage from './MainCoursePage';
import CoursesTable from './CoursesTable';
import CourseInstanceViewer from './CourseInstanceViewer';
import CourseInstanceManager from './CourseInstanceManager';

function getSelectionFromHash() {
  const hash = window.location.hash.replace('#', '');
  if ([
    'view-courses',
    'edit-courses',
    'view-delivery',
    'edit-delivery',
  ].includes(hash)) {
    return hash;
  }
  return null;
}

function App() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    description: '',
    academicYear: '',
    semester: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);

  const [mainPageSelection, setMainPageSelection] = useState(getSelectionFromHash());

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (mainPageSelection) {
      window.location.hash = mainPageSelection;
    } else {
      window.location.hash = '';
    }
  }, [mainPageSelection]);

  const fetchCourses = () => {
    axios.get('http://localhost:8081/api/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const courseData = { ...formData, prerequisiteIds: selectedPrerequisites };
    const url = `http://localhost:8081/api/courses${isEditing ? '/' + editingCourseId : ''}`;
    const axiosMethod = isEditing ? axios.put : axios.post;

    axiosMethod(url, courseData)
      .then(() => {
        setFormData({ title: '', courseId: '', description: '', academicYear: '', semester: '' });
        setSelectedPrerequisites([]);
        setIsEditing(false);
        setEditingCourseId(null);
        fetchCourses();
      })
      .catch(err => console.error('Error saving course:', err));
  };

  const handleDelete = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    axios.delete(`http://localhost:8081/api/courses/${courseId}`)
      .then(fetchCourses)
      .catch(err => console.error('Error deleting course:', err));
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      courseId: course.courseId,
      description: course.description,
      academicYear: course.academicYear,
      semester: course.semester
    });
    setIsEditing(true);
    setEditingCourseId(course.courseId);
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

  if (!mainPageSelection) {
    return <MainCoursePage onSelect={setMainPageSelection} />;
  }

  if (mainPageSelection === 'view-courses') {
    return <CoursesTable onBack={() => setMainPageSelection(null)} />;
  }
  if (mainPageSelection === 'edit-courses') {
    return <CoursesTable onBack={() => setMainPageSelection(null)} editable={true} onEdit={(course) => alert('Edit course: ' + course.title)} />;
  }
  if (mainPageSelection === 'view-delivery') {
  return (
    <CourseInstanceViewer
      onBack={() => setMainPageSelection(null)}
    />
  );
}

  if (mainPageSelection === 'edit-delivery') {
  return (
    <CourseInstanceManager onBack={() => setMainPageSelection(null)} />
  );
}

}

export default App;