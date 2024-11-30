import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import KeystrokeAnalytics from "./KeystrokeAnalytics";
import FaceYawDetection from "./faceapi";
import styles from "../styles/Ques.module.css";
import ExamEnvironment from "./ExamEnvironment";
import withAudioMonitoring from "./speech/speechrecog";
import { Code, FileUp, Video, Code2, Palette, Megaphone } from "lucide-react";

import { examData, EXAM_CONFIG, getQuestionCount } from "../data/examData";
const keys = Object.entries(examData);
const QuestionCard = ({ domain }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const analyticsRef = useRef();
  const [selectedDomain, setSelectedDomain] = useState(domain);
  const [currentSection, setCurrentSection] = useState("mcqs");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    mcqs: {},
    descriptive: {},
    domainSpecific: {},
  });
  const [timeLeft, setTimeLeft] = useState(EXAM_CONFIG.timeLimit);
  useEffect(() => {
    if (!selectedDomain) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedDomain]);

  const handleSubmit = async () => {
    if (!selectedDomain) return;

    const behaviorAnalysis = analyticsRef.current.getCurrentAnalysis();
    const formData = new FormData();

    const submissionData = {
      userId: user?.email,
      domain: selectedDomain,
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
        domainSpecific: {
          questionId: `${selectedDomain}-${selectedDomain}-1`,
          code:
            selectedDomain === "coding"
              ? answers.domainSpecific.description
              : null,
          language: selectedDomain === "coding" ? "python" : null,
          design_description:
            selectedDomain === "design"
              ? answers.domainSpecific.description
              : null,
          video_description:
            selectedDomain === "marketing"
              ? answers.domainSpecific.description
              : null,
        },
      },
      behaviorAnalysis,
    };

    // Handle file uploads
    if (answers.domainSpecific.file) {
      if (selectedDomain === "design") {
        formData.append("designFile", answers.domainSpecific.file);
      } else if (selectedDomain === "marketing") {
        formData.append("videoFile", answers.domainSpecific.file);
      }
    }

    formData.append("examData", JSON.stringify(submissionData));

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
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  if (!selectedDomain) {
    const domains = [
      {
        id: "coding",
        title: "Coding",
        icon: Code2,
        description: "Software development and programming challenges",
        color: "bg-blue-500",
      },
      {
        id: "design",
        title: "Design",
        icon: Palette,
        description: "UI/UX and visual design projects",
        color: "bg-purple-500",
      },
      {
        id: "marketing",
        title: "Marketing",
        icon: Megaphone,
        description: "Digital marketing and content strategy",
        color: "bg-green-500",
      },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            Select Your Domain
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Choose your specialization area to begin the assessment
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map(({ id, title, icon: Icon, description, color }) => (
              <button
                key={id}
                onClick={() => setSelectedDomain(id)}
                className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
              >
                <div
                  className={`${color} text-white p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm">{description}</p>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderQuestionButtons = () => {
    if (currentSection === "domainSpecific") return null;

    const totalQuestions = getQuestionCount(currentSection);
    return Array.from({ length: totalQuestions }, (_, index) => {
      const questionNumber = index + 1;
      const isAnswered =
        currentSection === "mcqs"
          ? answers.mcqs[`${selectedDomain}-mcq-${index}`]
          : answers.descriptive[`${selectedDomain}-desc-${index + 1}`];

      return (
        <button
          key={questionNumber}
          className={`${styles.questionButton} ${
            currentQuestionIndex === index ? styles.current : ""
          } ${isAnswered ? styles.answered : ""}`}
          onClick={() => setCurrentQuestionIndex(index)}
        >
          {questionNumber}
        </button>
      );
    });
  };

  const renderDomainSpecific = () => {
    const handleDescriptionChange = (e) => {
      setAnswers((prev) => ({
        ...prev,
        domainSpecific: {
          ...prev.domainSpecific,
          description: e.target.value,
        },
      }));
    };

    const handleFileChange = (e) => {
      setAnswers((prev) => ({
        ...prev,
        domainSpecific: {
          ...prev.domainSpecific,
          file: e.target.files[0],
        },
      }));
    };
    const commonTextAreaClasses =
      "w-full p-4 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-gray-800 mt-4";
    const commonFileInputClasses =
      "flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200";
    const headingClasses = "text-2xl font-semibold mb-6 text-gray-800";
    const instructionClasses = "text-gray-600 mb-4";

    switch (selectedDomain) {
      case "coding":
        return (
          <div className="space-y-4 w-full">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className={headingClasses}>Python Coding Challenge</h2>
              <p className={instructionClasses}>
                Write a Python script that prints 'A' character n times based on
                input
              </p>
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <code className="text-sm text-gray-700">
                  Example: n=1
                  <br />
                  Output: A
                </code>
              </div>
              <textarea
                className={`${commonTextAreaClasses} h-96`}
                value={answers.domainSpecific.description || ""}
                onChange={handleDescriptionChange}
                placeholder="# Write your Python code here..."
              />
            </div>
          </div>
        );

      case "design":
        return (
          <div className="space-y-4 w-full">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className={headingClasses}>Design Submission</h2>
              <p className={instructionClasses}>
                Create and submit a unique interpretation of our company logo
              </p>
              <label className={commonFileInputClasses}>
                <input
                  type="file"
                  className="hidden"
                  accept=".psd,.ai,.fig,.sketch,.pdf"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <FileUp className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Drop your design file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PSD, AI, Figma, Sketch, PDF
                  </p>
                </div>
              </label>
              <textarea
                className={`${commonTextAreaClasses} h-48 mt-6`}
                value={answers.domainSpecific.description || ""}
                onChange={handleDescriptionChange}
                placeholder="Describe your design approach, inspiration, and key elements..."
              />
            </div>
          </div>
        );

      case "marketing":
        return (
          <div className="space-y-4 w-full">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className={headingClasses}>Marketing Campaign Submission</h2>
              <p className={instructionClasses}>
                Create and submit a video pitch for your chosen product
              </p>
              <label className={commonFileInputClasses}>
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Drop your video file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: MP4, MOV, AVI
                  </p>
                </div>
              </label>
              <textarea
                className={`${commonTextAreaClasses} h-48 mt-6`}
                value={answers.domainSpecific.description || ""}
                onChange={handleDescriptionChange}
                placeholder="Describe your marketing strategy, target audience, and key message..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentQuestions =
    currentSection !== "domainSpecific"
      ? examData[selectedDomain][currentSection]
      : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <ExamEnvironment>
        <KeystrokeAnalytics ref={analyticsRef} />
        <FaceYawDetection />

        <header className={styles.header}>
          <h1 className={styles.title}>
            Online Test -{" "}
            {selectedDomain.charAt(0).toUpperCase() + selectedDomain.slice(1)}
          </h1>
          <div className={styles.timer}>
            Time Left: {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.questionSection}>
            {currentSection !== "domainSpecific" ? (
              <>
                <h2 className={styles.questionHeader}>
                  Question {currentQuestionIndex + 1}/
                  {getQuestionCount(currentSection)}
                </h2>

                {currentSection === "mcqs" ? (
                  <>
                    <p className={styles.questionText}>
                      {currentQuestion.question}
                    </p>
                    <div className={styles.answerForm}>
                      {currentQuestion.options.map((option, index) => (
                        <label key={index} className={styles.answerOption}>
                          <input
                            type="radio"
                            name={currentQuestion.id}
                            value={option}
                            checked={
                              answers.mcqs[currentQuestion.id] === option
                            }
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                mcqs: {
                                  ...prev.mcqs,
                                  [currentQuestion.id]: option,
                                },
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className={styles.questionText}>
                      {currentQuestion.question}
                    </p>
                    <textarea
                      className={styles.textArea}
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
                      placeholder="Write your answer here..."
                    />
                  </>
                )}
              </>
            ) : (
              renderDomainSpecific()
            )}

            <div className={styles.navigationButtons}>
              <button
                className={styles.navButton}
                onClick={() => {
                  if (currentSection === "domainSpecific") {
                    setCurrentSection("descriptive");
                    setCurrentQuestionIndex(EXAM_CONFIG.descriptiveCount - 1);
                  } else if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex((prev) => prev - 1);
                  } else if (currentSection === "descriptive") {
                    setCurrentSection("mcqs");
                    setCurrentQuestionIndex(EXAM_CONFIG.mcqCount - 1);
                  }
                }}
              >
                Previous
              </button>
              <button
                className={styles.navButton}
                onClick={() => {
                  if (
                    currentSection === "mcqs" &&
                    currentQuestionIndex < EXAM_CONFIG.mcqCount - 1
                  ) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                  } else if (
                    currentSection === "mcqs" &&
                    currentQuestionIndex === EXAM_CONFIG.mcqCount - 1
                  ) {
                    setCurrentSection("descriptive");
                    setCurrentQuestionIndex(0);
                  } else if (
                    currentSection === "descriptive" &&
                    currentQuestionIndex < EXAM_CONFIG.descriptiveCount - 1
                  ) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                  } else if (
                    currentSection === "descriptive" &&
                    currentQuestionIndex === EXAM_CONFIG.descriptiveCount - 1
                  ) {
                    setCurrentSection("domainSpecific");
                  } else {
                    handleSubmit();
                  }
                }}
              >
                {currentSection === "domainSpecific" ? "Submit" : "Next"}
              </button>
            </div>
          </section>

          <aside className={styles.questionStatus}>
            <h3>Questions</h3>
            <div className={styles.questionGrid}>{renderQuestionButtons()}</div>
          </aside>
        </main>

        <footer className={styles.footer}>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit Test
          </button>
        </footer>
      </ExamEnvironment>
    </div>
  );
};

export default withAudioMonitoring(QuestionCard, {
  warningThreshold: 3,
  maxViolations: 5,
  keywordMatchTimeout: 10000,
});
