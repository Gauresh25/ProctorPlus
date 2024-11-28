import React, { useRef, useState } from "react";
import KeystrokeAnalytics from "../components/KeystrokeAnalytics";
import ExamEnvironment from "../components/ExamEnvironment";

const TestPage= () => {
  const analyticsRef = useRef();
  const [formData, setFormData] = useState({
    answer: "",
  });
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const behaviorAnalysis = analyticsRef.current.getCurrentAnalysis();
    console.log("Behavior Analysis:", behaviorAnalysis);

    setLastAnalysis(behaviorAnalysis); // Save for display

    //uncomment jab actually bhejna ho
    /*
    try {
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
    <ExamEnvironment><div className="p-4">
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
    </ExamEnvironment>
  );
};

export default TestPage;
