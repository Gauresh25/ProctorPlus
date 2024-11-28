import React, { useState, useEffect } from 'react';

const AudioMCQMonitor = () => {
  const [transcript, setTranscript] = useState('');
  const [flaggedKeywords, setFlaggedKeywords] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const question = "Which is the largest planet in our solar system?";
  const options = ["A. Earth", "B. Jupiter", "C. Mars", "D. Venus"];

  const extractKeywords = (question, options) => {
    const questionKeywords = question.split(' ').filter(word => word.length > 3);
    const optionKeywords = options.map(option => option.split('. ')[1]);
    return [...questionKeywords, ...optionKeywords];
  };

  const keywordsToFlag = extractKeywords(question, options);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const interimTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      
      setTranscript(interimTranscript);

      // Check for keywords
      const detectedKeywords = keywordsToFlag.filter((keyword) =>
        interimTranscript.toLowerCase().includes(keyword.toLowerCase())
      );

      if (detectedKeywords.length > 0) {
        setFlaggedKeywords((prev) => [...new Set([...prev, ...detectedKeywords])]);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      console.log('Speech recognition stopped.');
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
    setIsListening(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>MCQ Audio Monitoring</h2>
      <h3>Question:</h3>
      <p>{question}</p>
      <h4>Options:</h4>
      <ul>
        {options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      <h3>Transcript:</h3>
      <p>{transcript || 'No speech detected yet...'}</p>

      <h3>Flagged Keywords:</h3>
      <ul>
        {flaggedKeywords.length > 0
          ? flaggedKeywords.map((keyword, index) => <li key={index}>{keyword}</li>)
          : <li>No keywords flagged yet.</li>}
      </ul>
    </div>
  );
};

export default AudioMCQMonitor;
