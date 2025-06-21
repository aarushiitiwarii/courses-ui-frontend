import './CourseLanding.css';

export default function CourseLanding({ onSelect }) {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Course Management Database</h1>

      <div className="landing-buttons">
        <button onClick={() => onSelect('courses')}>All Courses</button>
        <button onClick={() => onSelect('instances')}>All Course Delivery Instances</button>
      </div>
    </div>
  );
}
