import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import KeystrokeAnalytics from "../KeystrokeAnalytics";

// Dummy data for questions
const examData = {
  design: {
    mcqs: Array(12)
      .fill(null)
      .map((_, i) => ({
        id: `design-mcq-${i}`,
        question: `Design MCQ Question ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
      })),
    descriptive: [
      {
        id: "design-desc-1",
        question: "Explain the principles of user-centered design.",
      },
      {
        id: "design-desc-2",
        question: "How would you approach designing a mobile-first website?",
      },
    ],
  },
  coding: {
    mcqs: Array(12)
      .fill(null)
      .map((_, i) => ({
        id: `coding-mcq-${i}`,
        question: `Coding MCQ Question ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
      })),
    descriptive: [
      {
        id: "coding-desc-1",
        question: "Explain time complexity and space complexity.",
      },
      {
        id: "coding-desc-2",
        question: "Describe the differences between REST and GraphQL.",
      },
    ],
  },
  marketing: {
    mcqs: Array(12)
      .fill(null)
      .map((_, i) => ({
        id: `marketing-mcq-${i}`,
        question: `Marketing MCQ Question ${i + 1}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
      })),
    descriptive: [
      {
        id: "marketing-desc-1",
        question: "Explain the concept of customer segmentation.",
      },
      {
        id: "marketing-desc-2",
        question: "How would you develop a social media marketing strategy?",
      },
    ],
  },
};

const Examinterface = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const analyticsRef = useRef();
  const [domain, setDomain] = useState("");
  const [answers, setAnswers] = useState({
    mcqs: {},
    descriptive: {},
  });
  const [currentSection, setCurrentSection] = useState("mcqs");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSubmit = async () => {
    const behaviorAnalysis = analyticsRef.current.getCurrentAnalysis();

    // Create FormData for file uploads
    const formData = new FormData();

    const examData = {
      userId: user?.email,
      domain,
      answers: {
        mcqs: Object.entries(answers.mcqs).map(([id, answer]) => ({
          questionId: id,
          answer,
          type: "mcq",
        })),
        descriptive: Object.entries(answers.descriptive).map(
          ([id, answer]) => ({
            questionId: id,
            answer,
            type: "descriptive",
          })
        ),
        domainSpecific: {},
      },
      behaviorAnalysis,
    };

    // Add domain-specific data
    if (domain === "coding") {
      examData.answers.domainSpecific = {
        dsaAnswer: {
          code: answers.dsa?.code || "",
          language: answers.dsa?.language || "javascript",
          questionId: `${domain}-dsa-1`,
        },
      };
    } else if (domain === "design") {
      if (answers.design?.file) {
        formData.append("designFile", answers.design.file);
        examData.answers.domainSpecific = {
          designFile: {
            description: answers.design.description,
            questionId: `${domain}-design-1`,
          },
        };
      }
    } else if (domain === "marketing") {
      if (answers.marketing?.file) {
        formData.append("videoFile", answers.marketing.file);
        examData.answers.domainSpecific = {
          videoFile: {
            description: answers.marketing.description,
            questionId: `${domain}-marketing-1`,
          },
        };
      }
    }

    formData.append("examData", JSON.stringify(examData));
    console.log( examData);

    try {
      const response = await fetch("http://localhost:8000/api/exam/submit/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/exam-complete");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  if (!domain) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Select Your Domain</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["design", "coding", "marketing"].map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 capitalize"
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Only get currentQuestion if we're in mcqs or descriptive sections
  const currentQuestions =
    currentSection !== "domainSpecific"
      ? examData[domain][currentSection]
      : null;
  const currentQuestion = currentQuestions
    ? currentQuestions[currentQuestionIndex]
    : null;
  const isLastQuestion =
    currentSection === "descriptive" && currentQuestionIndex === 1;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold capitalize">{domain} Exam</h1>
        <div className="text-gray-600">
          {currentSection === "mcqs" &&
            `Question ${currentQuestionIndex + 1}/12`}
          {currentSection === "descriptive" &&
            `Descriptive ${currentQuestionIndex + 1}/2`}
          {currentSection === "domainSpecific" && "Domain Challenge"}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        {currentSection === "domainSpecific" ? (
          <div>
            {domain === "coding" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Code Implementation Challenge
                </h2>
                <select
                  value={answers.dsa?.language || "javascript"}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      dsa: { ...prev.dsa, language: e.target.value },
                    }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
                <textarea
                  value={answers.dsa?.code || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      dsa: { ...prev.dsa, code: e.target.value },
                    }))
                  }
                  className="w-full h-64 p-2 border rounded font-mono"
                  placeholder="Write your implementation here..."
                />
              </div>
            )}
            {domain === "design" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Design Implementation Challenge
                </h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      design: { ...prev.design, file: e.target.files[0] },
                    }))
                  }
                  className="w-full"
                />
                <textarea
                  value={answers.design?.description || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      design: { ...prev.design, description: e.target.value },
                    }))
                  }
                  className="w-full h-32 p-2 border rounded"
                  placeholder="Describe your design choices..."
                />
              </div>
            )}
            {domain === "marketing" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Marketing Implementation Challenge
                </h2>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      marketing: { ...prev.marketing, file: e.target.files[0] },
                    }))
                  }
                  className="w-full"
                />
                <textarea
                  value={answers.marketing?.description || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      marketing: {
                        ...prev.marketing,
                        description: e.target.value,
                      },
                    }))
                  }
                  className="w-full h-32 p-2 border rounded"
                  placeholder="Describe your marketing strategy..."
                />
              </div>
            )}
          </div>
        ) : (
          currentQuestion && (
            <div>
              {currentSection === "mcqs" ? (
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    {currentQuestion.question}
                  </h2>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={answers.mcqs[currentQuestion.id] === option}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              mcqs: {
                                ...prev.mcqs,
                                [currentQuestion.id]: option,
                              },
                            }))
                          }
                          className="h-4 w-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    {currentQuestion.question}
                  </h2>
                  <textarea
                    value={answers.descriptive[currentQuestion.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        descriptive: {
                          ...prev.descriptive,
                          [currentQuestion.id]: e.target.value,
                        },
                      }))
                    }
                    className="w-full h-32 p-2 border rounded"
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex((prev) => prev - 1);
            } else if (currentSection === "descriptive") {
              setCurrentSection("mcqs");
              setCurrentQuestionIndex(11);
            } else if (currentSection === "domainSpecific") {
              setCurrentSection("descriptive");
              setCurrentQuestionIndex(1);
            }
          }}
          disabled={currentSection === "mcqs" && currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() => {
            if (currentSection === "mcqs" && currentQuestionIndex < 11) {
              setCurrentQuestionIndex((prev) => prev + 1);
            } else if (
              currentSection === "mcqs" &&
              currentQuestionIndex === 11
            ) {
              setCurrentSection("descriptive");
              setCurrentQuestionIndex(0);
            } else if (
              currentSection === "descriptive" &&
              currentQuestionIndex < 1
            ) {
              setCurrentQuestionIndex((prev) => prev + 1);
            } else if (
              currentSection === "descriptive" &&
              currentQuestionIndex === 1
            ) {
              setCurrentSection("domainSpecific");
              setCurrentQuestionIndex(0);
            } else {
              handleSubmit();
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {currentSection === "domainSpecific" ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Examinterface;
