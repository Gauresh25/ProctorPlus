import React, { useEffect, useState, useRef } from 'react';

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
      <h3 className="text-lg font-semibold text-red-600 mb-4">Voice Detection Warning</h3>
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

const withAudioMonitoring = (WrappedComponent, options = {}) => {
  const {
    warningThreshold = 3,
    maxViolations = 5,
    keywordMatchTimeout = 10000
  } = options;

  return function AudioMonitoredComponent(props) {
    const [violations, setViolations] = useState(0);
    const [modalMessage, setModalMessage] = useState('');
    const keywordMatchesRef = useRef(0);
    const timeoutRef = useRef(null);
    const recognitionRef = useRef(null);

    const resetKeywordMatches = () => {
      keywordMatchesRef.current = 0;
    };

    const handleViolation = () => {
      setViolations(prev => {
        const newCount = prev + 1;
        if (newCount >= maxViolations) {
          cleanup();
          setModalMessage('Multiple voice violations detected. Exam will be terminated.');
          if (props.onExamTerminate) {
            props.onExamTerminate();
          }
          return newCount;
        }
        setModalMessage(`Topic related keywords detected in ur speech,Do not speak during exam. Warning ${newCount}/${maxViolations}`);
        return newCount;
      });
    };

    const closeModal = () => {
      setModalMessage('');
    };

    const startSpeechRecognition = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Speech Recognition not supported in this browser.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
          .toLowerCase();

        // Check for exam-related keywords
        //const keywords = ['answer', 'question', 'option', 'correct', 'wrong', 'solution','python','complexity','binary','search','queue','stack'];
        const keywords = [
    // Exam/Assessment terms
    'question', 'answer', 'correct', 'option', 'sample', 'description', 
    'solution', 'example', 'constraint', 'score', 'maximum', 'minimum',
    'test', 'exam', 'quiz', 'grade', 'point', 'mark', 'submission',
    'response', 'attempt', 'evaluate', 'assessment', 'review', 'check',

    // Technical/Coding fundamentals
    'complexity', 'binary', 'search', 'queue', 'stack', 'sort', 'algorithm',
    'array', 'list', 'tree', 'graph', 'hash', 'map', 'set', 'dictionary',
    'pointer', 'reference', 'memory', 'allocation', 'garbage', 'collection',
    'compile', 'runtime', 'debug', 'error', 'exception', 'syntax',

    // Algorithms & Data Structures
    'bubble', 'quick', 'merge', 'heap', 'insertion', 'selection', 'radix',
    'linear', 'binary', 'interpolation', 'sequential', 'traverse', 'iterate',
    'recursive', 'iteration', 'depth', 'breadth', 'first', 'dynamic',
    'greedy', 'backtrack', 'memoization', 'optimization',

    // Programming Languages & Concepts
    'javascript', 'python', 'java', 'cpp', 'csharp', 'ruby', 'php',
    'function', 'class', 'object', 'method', 'variable', 'constant',
    'loop', 'condition', 'statement', 'expression', 'operator', 'operand',
    'inheritance', 'polymorphism', 'encapsulation', 'abstraction',

    // Web Development
    'html', 'css', 'javascript', 'dom', 'api', 'ajax', 'json', 'xml',
    'rest', 'graphql', 'http', 'https', 'request', 'response', 'server',
    'client', 'database', 'query', 'endpoint', 'route', 'middleware',
    'framework', 'library', 'package', 'module', 'component', 'prop',

    // Design Elements
    'design', 'layout', 'color', 'typography', 'spacing', 'alignment',
    'contrast', 'hierarchy', 'balance', 'rhythm', 'scale', 'proportion',
    'grid', 'composition', 'whitespace', 'negative', 'space', 'form',
    'texture', 'pattern', 'shape', 'line', 'point', 'volume', 'depth',

    // Design Systems & Tools
    'responsive', 'adaptive', 'mobile', 'desktop', 'tablet', 'breakpoint',
    'wireframe', 'prototype', 'mockup', 'sketch', 'figma', 'adobe', 'xd',
    'accessibility', 'usability', 'interface', 'experience', 'interaction',
    'animation', 'transition', 'transform', 'navigation', 'menu', 'modal',

    // Marketing Concepts
    'marketing', 'brand', 'campaign', 'strategy', 'target', 'audience',
    'demographic', 'psychographic', 'segmentation', 'positioning', 'value',
    'proposition', 'funnel', 'journey', 'conversion', 'retention', 'churn',
    'acquisition', 'engagement', 'reach', 'impression', 'click', 'view',

    // Digital Marketing
    'seo', 'sem', 'ppc', 'cpc', 'cpa', 'roi', 'roas', 'kpi', 'metric',
    'analytics', 'tracking', 'pixel', 'tag', 'utm', 'organic', 'paid',
    'social', 'media', 'content', 'email', 'newsletter', 'automation',
    'influencer', 'affiliate', 'viral', 'growth', 'hack', 'optimization',

    // File Formats & Technical Specs
    'rgb', 'cmyk', 'hex', 'rgba', 'hsla', 'svg', 'png', 'jpg', 'jpeg',
    'gif', 'webp', 'bitmap', 'vector', 'raster', 'resolution', 'dpi',
    'pixel', 'byte', 'bit', 'binary', 'ascii', 'unicode', 'utf', 'encode',
    'decode', 'compress', 'decompress', 'encrypt', 'decrypt', 'hash'
];
	const hasKeywords = keywords.some(keyword => transcript.includes(keyword));

        if (hasKeywords) {
          keywordMatchesRef.current += 1;

          // Clear existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Set new timeout to reset matches
          timeoutRef.current = setTimeout(resetKeywordMatches, keywordMatchTimeout);

          // Check if threshold is exceeded
          if (keywordMatchesRef.current >= warningThreshold) {
            handleViolation();
            resetKeywordMatches();
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
      };

      recognitionRef.current.start();
    };

    const cleanup = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    useEffect(() => {
      startSpeechRecognition();
      return cleanup;
    }, []);

    return (
      <>
        {modalMessage && (
          <Modal message={modalMessage} onClose={closeModal} />
        )}
        <WrappedComponent {...props} audioViolations={violations} />
      </>
    );
  };
};

export default withAudioMonitoring;
