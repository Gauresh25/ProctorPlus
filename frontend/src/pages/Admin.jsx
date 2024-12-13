import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        "/api/submissions/analytics/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      if (data.status === "success") {
        setSubmissions(data.data.submissions);
        setStatistics({
          total: data.data.total_submissions,
          byDomain: data.data.domain_statistics,
        });
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchSubmissionDetail = async (id) => {
    try {
      const response = await fetch(
        `/api/submissions/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch submission details");

      const data = await response.json();
      if (data.status === "success") {
        setSelectedSubmission(data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const calculateDomainStats = () => {
    const domainData = {};
    submissions.forEach((sub) => {
      if (!domainData[sub.domain]) {
        domainData[sub.domain] = {
          totalScore: 0,
          count: 0,
          scores: [],
        };
      }
      domainData[sub.domain].totalScore += sub.total_score;
      domainData[sub.domain].count += 1;
      domainData[sub.domain].scores.push(sub.total_score);
    });

    return Object.entries(domainData).map(([domain, data]) => ({
      domain,
      avgScore: data.totalScore / data.count,
      count: data.count,
      maxScore: Math.max(...data.scores),
      minScore: Math.min(...data.scores),
    }));
  };

  const renderDetailView = () => {
    if (!selectedSubmission) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Submission Details</h2>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">User Information</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{selectedSubmission.user_email}</p>
              </div>
              <div>
                <p className="text-gray-600">Domain</p>
                <p className="font-medium capitalize">
                  {selectedSubmission.domain}
                </p>
              </div>
            </div>
          </div>

          {/* MCQ Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">MCQ Responses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSubmission.mcq_answers.map((mcq, index) => (
                <div
                  key={index}
                  className={`p-4 rounded ${
                    mcq.is_correct ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p className="font-medium">Question {mcq.question_id}</p>
                  <p className="text-gray-600">Selected: {mcq.answer}</p>
                  <p
                    className={`text-sm ${
                      mcq.is_correct ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {mcq.is_correct ? "Correct" : "Incorrect"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Descriptive Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              Descriptive Responses
            </h3>
            {selectedSubmission.descriptive_answers.map((desc, index) => (
              <div key={index} className="mb-4 bg-gray-50 p-4 rounded">
                <p className="font-medium mb-2">Question {desc.question_id}</p>
                <p className="text-gray-600 whitespace-pre-wrap mb-2">
                  {desc.answer}
                </p>
                <div className="flex items-center">
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded"
                      style={{ width: `${(desc.score / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {desc.score}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Domain Specific Section */}
          {selectedSubmission.domain_specific && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Domain Specific Task</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="mb-4">
                  <p className="font-medium">Question {selectedSubmission.domain_specific.question_id}</p>
                  <div className="flex items-center mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded">
                      <div 
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${(selectedSubmission.domain_specific.score / 20) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{selectedSubmission.domain_specific.score}/20</span>
                  </div>
                </div>

                {selectedSubmission.domain === 'coding' && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2">Code Submission</p>
                    <div className="bg-gray-800 text-white p-4 rounded font-mono text-sm whitespace-pre-wrap">
                      {selectedSubmission.domain_specific.code}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Language: {selectedSubmission.domain_specific.language}</p>
                  </div>
                )}

                {selectedSubmission.domain === 'design' && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2">Design Submission</p>
                    <p className="text-sm mb-2">{selectedSubmission.domain_specific.design_description}</p>
                    <a 
                      href={selectedSubmission.domain_specific.design_file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Design File →
                    </a>
                  </div>
                )}

                {selectedSubmission.domain === 'marketing' && (
                  <div className="mt-4">
                    <p className="text-gray-600 mb-2">Marketing Submission</p>
                    <p className="text-sm mb-2">{selectedSubmission.domain_specific.video_description}</p>
                    <a 
                      href={selectedSubmission.domain_specific.video_file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Video Pitch →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Behavior Analysis */}
          {selectedSubmission.behavior_analysis && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Behavior Analysis</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Bot Detection</p>
                    <p
                      className={`font-medium ${
                        selectedSubmission.behavior_analysis.is_likely_bot
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {selectedSubmission.behavior_analysis.is_likely_bot
                        ? "Suspicious Activity"
                        : "Normal Activity"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Confidence</p>
                    <p className="font-medium">
                      {selectedSubmission.behavior_analysis.confidence.toFixed(
                        2
                      ) * 100}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Key Presses</p>
                    <p className="font-medium">
                      {selectedSubmission.behavior_analysis.total_key_presses}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Backspaces</p>
                    <p className="font-medium">
                      {selectedSubmission.behavior_analysis.backspace_count}
                    </p>
                  </div>
                </div>
                {selectedSubmission.behavior_analysis.reasons?.length > 0 && (
                  <div>
                    <p className="text-gray-600 mb-2">Detection Reasons:</p>
                    <ul className="list-disc pl-5">
                      {selectedSubmission.behavior_analysis.reasons.map(
                        (reason, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {reason}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          

          {/* Plagiarism Analysis */}
          {selectedSubmission.plagiarism?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Plagiarism Detection
              </h3>
              <div className="space-y-2">
                {selectedSubmission.plagiarism.map((plag, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded">
                    <p className="font-medium">Question {plag.question_id}</p>
                    <p className="text-gray-600">Match: {plag.label}</p>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-full bg-gray-200 rounded">
                        <div
                          className={`h-2 rounded ${
                            plag.confidence > 70
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${plag.confidence* 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {plag.confidence * 100}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Exam Submissions Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {statistics && (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-gray-500 text-sm uppercase">
                Total Submissions
              </h2>
              <p className="text-2xl font-bold mt-1">{statistics.total}</p>
            </div>
            {calculateDomainStats().map((stat) => (
              <div key={stat.domain} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-gray-500 text-sm uppercase">
                  {stat.domain}
                </h2>
                <p className="text-2xl font-bold mt-1">{stat.count}</p>
                <div className="mt-2 text-sm">
                  <p>Avg Score: {stat.avgScore.toFixed(1)}</p>
                  <p className="text-green-600">High: {stat.maxScore}</p>
                  <p className="text-red-600">Low: {stat.minScore}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Score Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={submissions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="created_at"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_score"
              stroke="#3b82f6"
              name="Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bot Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(submission.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.user_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    {submission.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.total_score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.behavior_analysis?.is_likely_bot ? (
                      <span className="text-red-600">High</span>
                    ) : (
                      <span className="text-green-600">Low</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => fetchSubmissionDetail(submission.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {renderDetailView()}
    </div>
  );
};

export default AdminDashboard;
