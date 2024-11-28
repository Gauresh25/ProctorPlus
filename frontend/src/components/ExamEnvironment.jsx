import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
      <h3 className="text-lg font-semibold text-red-600 mb-4">Warning</h3>
      <p className="text-gray-700 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
      >
        Acknowledge
      </button>
    </div>
  </div>
);

const ExamEnvironment = ({ children }) => {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [modalMessage, setModalMessage] = useState('');
  const MAX_WARNINGS = 3;
  const warningTimeoutRef = useRef(null);

  const startExam = async () => {
    try {
      await document.documentElement.requestFullscreen();
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);
      document.addEventListener('keydown', blockShortcuts);
      document.addEventListener('contextmenu', blockContextMenu);
      document.addEventListener('copy', blockCopy);
      document.addEventListener('keydown', blockCopy);
      setExamStarted(true);
    } catch (err) {
      setModalMessage('Fullscreen access required for exam. Please enable and try again.');
    }
  };

  const handleFullscreenChange = async () => {
    if (!document.fullscreenElement) {
      try {
        handleWarning('Exiting fullscreen is not allowed');
        // Remove the event listener temporarily
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        await document.documentElement.requestFullscreen();
        // Add the listener back after a short delay
        setTimeout(() => {
          document.addEventListener('fullscreenchange', handleFullscreenChange);
        }, 1000);
      } catch (err) {
        console.error('Failed to restore fullscreen:', err);
      }
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      handleWarning('Leaving the exam window is not allowed');
    }
  };

  const handleBlur = () => {
    handleWarning('Tab switching detected');
  };

  const handleWarning = (message) => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      setWarnings(prev => {
        const newWarnings = prev + 1;
        if (newWarnings >= MAX_WARNINGS) {
          cleanup();
          navigate('/exam-terminated');
        } else {
          setModalMessage(`Warning ${newWarnings}/${MAX_WARNINGS}: ${message}`);
        }
        return newWarnings;
      });
      warningTimeoutRef.current = null;
    }, 100);
  };

  const closeModal = () => {
    setModalMessage('');
  };

  const blockShortcuts = (e) => {
    if (['Alt', 'Tab', 'Meta', 'Win', 'Escape'].includes(e.key) || e.ctrlKey || e.altKey || e.metaKey) {
      e.preventDefault();
    }
  };

  const blockContextMenu = (e) => e.preventDefault();
  
  const blockCopy = (e) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
    }
  };

  const cleanup = () => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
    document.removeEventListener('keydown', blockShortcuts);
    document.removeEventListener('contextmenu', blockContextMenu);
    document.removeEventListener('copy', blockCopy);
    document.removeEventListener('keydown', blockCopy);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => cleanup, []);

  if (!examStarted) {
    return (
      <div className="flex h-screen items-center justify-center">
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
    <div className="exam-environment select-none">
      {warnings > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 border-b-4 border-red-500 text-red-700 px-4 py-2">
          Warning {warnings}/{MAX_WARNINGS} - Exam integrity violations detected
        </div>
      )}
      {modalMessage && (
        <Modal message={modalMessage} onClose={closeModal} />
      )}
      {children}
    </div>
  );
};

export default ExamEnvironment;