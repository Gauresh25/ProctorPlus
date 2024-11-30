import React, { useRef, useState } from "react";
import KeystrokeAnalytics from "../components/KeystrokeAnalytics";
import withAudioMonitoring from "../components/speech/speechrecog";


const TestPage = ({ audioViolations }) => {
  const analyticsRef = useRef();
  const [formData, setFormData] = useState({
    answer: "",
  });
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine keystroke analytics with audio violations
    const behaviorAnalysis = {
      ...analyticsRef.current.getCurrentAnalysis(),
      audioViolations: audioViolations // From HOC props
    };
    
    console.log("Behavior Analysis:", behaviorAnalysis);
    setLastAnalysis(behaviorAnalysis);

    /* When ready to submit to server:
    try {
      const submissionData = {
        answer: formData.answer,
        behaviorAnalysis
      };
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
    */
  };

  return (
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Type something to test:</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ answer: e.target.value })}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>

          <KeystrokeAnalytics ref={analyticsRef} />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test Analytics
          </button>
        </form>

        {lastAnalysis && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Last Analysis Results:</h3>
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(lastAnalysis, null, 2)}
            </pre>
          </div>
        )}
      </div>
    
  );
};

// Configure and export the monitored version
export default withAudioMonitoring(TestPage, {
  warningThreshold: 3,
  maxViolations: 3,
  keywordMatchTimeout: 10000
});