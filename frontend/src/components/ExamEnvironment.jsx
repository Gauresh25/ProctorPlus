import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExamEnvironment = ({ children }) => {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const MAX_WARNINGS = 3;

  const handleWarning = (message) => {
    console.log('Warning triggered:', message); // Debug log
    alert(`Warning: ${message}`);
    setWarnings(prev => {
      const newCount = prev + 1;
      console.log('Warning count:', newCount); // Debug log
      if (newCount >= MAX_WARNINGS) {
        cleanup();
        navigate('/exam-terminated');
      }
      return newCount;
    });
  };

  const handleFullscreenChange = (e) => {
    console.log('Fullscreen change event:', e); // Debug log
    console.log('Fullscreen element:', document.fullscreenElement); // Debug log
    if (!document.fullscreenElement && examStarted) {
      handleWarning('Fullscreen mode is required for the exam');
    }
  };

  const handleVisibilityChange = (e) => {
    console.log('Visibility change event:', e); // Debug log
    alert("Do not change tabs");
    console.log('Document hidden:', document.hidden); // Debug log
    if (document.hidden && examStarted) {
      handleWarning('Tab switching is not allowed during exam');
    }
  };

  const handleBlur = (e) => {
    console.log('Blur event:', e); // Debug log
    if (examStarted) {
      handleWarning('Window switching is not allowed during exam');
    }
  };

  const cleanup = () => {
    console.log('Cleanup called'); // Debug log
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  };

  const startExam = async () => {
    try {
      console.log('Starting exam...'); // Debug log
      await document.documentElement.requestFullscreen();
      console.log('Fullscreen requested'); // Debug log
      
      // Add event listeners
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);
      
      console.log('Event listeners added'); // Debug log
      setExamStarted(true);
    } catch (err) {
      console.error('Fullscreen error:', err); // Debug log
      alert('Fullscreen access required for exam. Please enable and try again.');
    }
  };

  // Add cleanup on unmount
  React.useEffect(() => {
    console.log('ExamEnvironment mounted'); // Debug log
    return () => {
      console.log('ExamEnvironment unmounting'); // Debug log
      cleanup();
    };
  }, []);

  if (!examStarted) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <h2 className="text-xl mb-4">Exam Rules</h2>
        <ul className="mb-4 text-left">
          <li>• Must stay in fullscreen mode</li>
          <li>• No tab switching allowed</li>
          <li>• No window switching allowed</li>
          <li>• {MAX_WARNINGS} violations will terminate exam</li>
        </ul>
        <button 
          onClick={startExam}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Start Exam
        </button>
      </div>
    );
  }

  return (
    <div className="exam-environment min-h-screen">
      {warnings > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          Warning {warnings}/{MAX_WARNINGS}
        </div>
      )}
      {children}
    </div>
  );
};

export default ExamEnvironment;