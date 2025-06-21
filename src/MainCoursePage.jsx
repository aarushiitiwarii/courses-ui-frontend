import React, { useState } from 'react';

const outerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100vw',
  background: '#f7f9fa',
};

const MainCoursePage = ({ onSelect }) => {
  const [showCoursesOptions, setShowCoursesOptions] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);

  const handleCoursesClick = () => {
    setShowCoursesOptions(!showCoursesOptions);
    setShowDeliveryOptions(false);
  };

  const handleDeliveryClick = () => {
    setShowDeliveryOptions(!showDeliveryOptions);
    setShowCoursesOptions(false);
  };

  return (
    <div style={outerContainerStyle}>
      <h1>Course Management Database</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Courses Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button style={{ padding: '1rem 2rem', fontSize: '1.2rem' }} onClick={handleCoursesClick}>
            All Courses
          </button>
          <div
            style={showCoursesOptions
              ? {
                  transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(.4,2,.6,1)',
                  opacity: 1,
                  transform: 'translateY(0)',
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }
              : {
                  transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(.4,2,.6,1)',
                  opacity: 0,
                  transform: 'translateY(-10px)',
                  pointerEvents: 'none',
                  height: 0,
                  overflow: 'hidden',
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
          >
            <button onClick={() => onSelect('view-courses')}>
              View All Courses
            </button>
            <button onClick={() => onSelect('edit-courses')}>
              Edit Course List
            </button>
          </div>
        </div>

        {/* Course Delivery Instances Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button style={{ padding: '1rem 2rem', fontSize: '1.2rem' }} onClick={handleDeliveryClick}>
            All Course Delivery Instances
          </button>
          <div
            style={showDeliveryOptions
              ? {
                  transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(.4,2,.6,1)',
                  opacity: 1,
                  transform: 'translateY(0)',
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }
              : {
                  transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(.4,2,.6,1)',
                  opacity: 0,
                  transform: 'translateY(-10px)',
                  pointerEvents: 'none',
                  height: 0,
                  overflow: 'hidden',
                  marginTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
          >
            <button onClick={() => onSelect('view-delivery')}>
              View All Course Delivery Instances
            </button>
            <button onClick={() => onSelect('edit-delivery')}>
              Edit Course Delivery Instances List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCoursePage;
