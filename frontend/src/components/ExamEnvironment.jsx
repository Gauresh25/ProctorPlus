import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MonitorUp, 
  Keyboard, 
  Copy, 
  MousePointerClick, 
  AlertTriangle ,
  Eye 
} from 'lucide-react';

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
  const MAX_WARNINGS = 5;
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Before You Begin</h1>
            <p className="text-gray-600">Please review the exam requirements below</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <MonitorUp className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Fullscreen Required</h3>
                <p className="text-sm text-gray-600">Exam must be taken in fullscreen mode</p>
              </div>
            </div>
  
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Eye className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Camera Monitoring</h3>
                <p className="text-sm text-gray-600">Face must be visible throughout exam</p>
              </div>
            </div>
  
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <MousePointerClick className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">No Tab Switching</h3>
                <p className="text-sm text-gray-600">Stay on this tab throughout the exam</p>
              </div>
            </div>
  
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Keyboard className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Keystroke Monitoring</h3>
                <p className="text-sm text-gray-600">All keystrokes are monitored</p>
              </div>
            </div>
  
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Copy className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">No Copy-Paste</h3>
                <p className="text-sm text-gray-600">Copy-paste functionality is disabled</p>
              </div>
            </div>
  
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <AlertTriangle className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Audio Proctored Environment</h3>
                <p className="text-sm text-gray-600">All activities are monitored, Including ur speech</p>
              </div>
            </div>
          </div>
  
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">By clicking Start Exam, you agree to these conditions</p>
            <button
              onClick={startExam}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Start Exam
            </button>
          </div>
        </div>
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