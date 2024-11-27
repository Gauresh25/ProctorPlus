import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import KeystrokeAnalytics from "./KeystrokeAnalytics";
import FaceYawDetection from "./faceapi";
import styles from "../styles/Ques.module.css";

// Expanded exam data to include all domains
const examData = {
  design: {
    mcqs: Array(12).fill(null).map((_, i) => ({
      id: `design-mcq-${i}`,
      question: `Design MCQ Question ${i + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"]
    })),
    descriptive: [
      {
        id: "design-desc-1",
        question: "Explain the principles of user-centered design."
      },
      {
        id: "design-desc-2",
        question: "How would you approach designing a mobile-first website?"
      }
    ]
  },
  coding: {
    mcqs: Array(12).fill(null).map((_, i) => ({
      id: `coding-mcq-${i}`,
      question: `Coding MCQ Question ${i + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"]
    })),
    descriptive: [
      {
        id: "coding-desc-1",
        question: "Explain time complexity and space complexity."
      },
      {
        id: "coding-desc-2",
        question: "What are the principles of clean code?"
      }
    ]
  },
  marketing: {
    mcqs: Array(12).fill(null).map((_, i) => ({
      id: `marketing-mcq-${i}`,
      question: `Marketing MCQ Question ${i + 1}?`,
      options: ["Option A", "Option B", "Option C", "Option D"]
    })),
    descriptive: [
      {
        id: "marketing-desc-1",
        question: "Explain the key components of a digital marketing strategy."
      },
      {
        id: "marketing-desc-2",
        question: "How would you measure the success of a marketing campaign?"
      }
    ]
  }
};

const QuestionCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const analyticsRef = useRef();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentSection, setCurrentSection] = useState("mcqs");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    mcqs: {},
    descriptive: {},
    domainSpecific: {}
  });
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 42, seconds: 27 });

  // Only start the timer when domain is selected
  useEffect(() => {
    if (!selectedDomain) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
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
          type: "mcq"
        })),
        descriptive: Object.entries(answers.descriptive).map(([id, answer]) => ({
          questionId: id,
          answer,
          type: "descriptive"
        })),
        domainSpecific: {
          [selectedDomain === 'coding' ? 'dsaAnswer' : 
           selectedDomain === 'design' ? 'designFile' : 'videoFile']: {
            description: answers.domainSpecific.description || "",
            questionId: `${selectedDomain}-${selectedDomain}-1`
          }
        }
      },
      behaviorAnalysis
    };

    if (answers.domainSpecific.file) {
      formData.append(`${selectedDomain}File`, answers.domainSpecific.file);
    }

    formData.append("examData", JSON.stringify(submissionData));

    try {
      const response = await fetch("http://localhost:8000/api/exam/submit/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: formData
      });

      if (response.ok) {
        navigate("/exam-complete");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  // If domain not selected, show domain selection screen
  if (!selectedDomain) {
    return (
      <div className={styles.container}>
        <div className={styles.domainSelection}>
          <h2 className={styles.title}>Select Your Domain</h2>
          <div className={styles.domainButtons}>
            {Object.keys(examData).map(domain => (
              <button
                key={domain}
                className={styles.domainButton}
                onClick={() => setSelectedDomain(domain)}
              >
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderQuestionButtons = () => {
    const totalQuestions = currentSection === "mcqs" ? 12 : 2;
    return Array.from({ length: totalQuestions }, (_, index) => {
      const questionNumber = index + 1;
      const isAnswered = currentSection === "mcqs" 
        ? answers.mcqs[`${selectedDomain}-mcq-${index}`]
        : answers.descriptive[`${selectedDomain}-desc-${index + 1}`];
      
      return (
        <button
          key={questionNumber}
          className={`${styles.questionButton} ${currentQuestionIndex === index ? styles.current : ''} ${isAnswered ? styles.answered : ''}`}
          onClick={() => setCurrentQuestionIndex(index)}
        >
          {questionNumber}
        </button>
      );
    });
  };

  const currentQuestions = examData[selectedDomain][currentSection];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <KeystrokeAnalytics ref={analyticsRef} />
      <FaceYawDetection />
      
      <header className={styles.header}>
        <h1 className={styles.title}>
          Online Test - {selectedDomain.charAt(0).toUpperCase() + selectedDomain.slice(1)}
        </h1>
        <div className={styles.timer}>
          Time Left: {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.questionSection}>
          <h2 className={styles.questionHeader}>
            Question {currentQuestionIndex + 1}
            {currentSection === "mcqs" ? "/12" : "/2"}
          </h2>
          
          {currentSection === "mcqs" ? (
            <>
              <p className={styles.questionText}>{currentQuestion.question}</p>
              <div className={styles.answerForm}>
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className={styles.answerOption}>
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers.mcqs[currentQuestion.id] === option}
                      onChange={() => setAnswers(prev => ({
                        ...prev,
                        mcqs: { ...prev.mcqs, [currentQuestion.id]: option }
                      }))}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className={styles.questionText}>{currentQuestion.question}</p>
              <textarea
                className={styles.textArea}
                value={answers.descriptive[currentQuestion.id] || ""}
                onChange={e => setAnswers(prev => ({
                  ...prev,
                  descriptive: { ...prev.descriptive, [currentQuestion.id]: e.target.value }
                }))}
                placeholder="Write your answer here..."
              />
            </>
          )}

          <div className={styles.navigationButtons}>
            <button 
              className={styles.navButton}
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                } else if (currentSection === "descriptive") {
                  setCurrentSection("mcqs");
                  setCurrentQuestionIndex(11);
                }
              }}
            >
              Previous
            </button>
            <button
              className={styles.navButton}
              onClick={() => {
                if (currentSection === "mcqs" && currentQuestionIndex < 11) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else if (currentSection === "mcqs" && currentQuestionIndex === 11) {
                  setCurrentSection("descriptive");
                  setCurrentQuestionIndex(0);
                } else if (currentSection === "descriptive" && currentQuestionIndex < 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  handleSubmit();
                }
              }}
            >
              {currentSection === "descriptive" && currentQuestionIndex === 1 ? "Submit" : "Next"}
            </button>
          </div>
        </section>

        <aside className={styles.questionStatus}>
          <h3>Questions</h3>
          <div className={styles.questionGrid}>
            {renderQuestionButtons()}
          </div>
        </aside>
      </main>

      <footer className={styles.footer}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit Test
        </button>
      </footer>
    </div>
  );
};

export default QuestionCard;