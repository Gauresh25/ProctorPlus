import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Ques.module.css";
import KeystrokeAnalytics from "./KeystrokeAnalytics";
import FaceYawDetection from "./faceapi";
const examData = [
  {
    type: "mcq",
    questionId: "design-mcq-0",
    title: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct: 2,
  },
  {
    type: "mcq",
    questionId: "design-mcq-1",
    title: "Which programming language is used for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correct: 1,
  },
  {
    type: "mcq",
    questionId: "design-mcq-2",
    title: "What is 5 + 3?",
    options: ["5", "8", "10", "12"],
    correct: 1,
  },
  {
    type: "des",
    questionId: "design-des-1",
    title: "Tell me about yourself.",
  },
  {
    type: "file",
    questionId: "design-file-1",
    title: "Upload your portfolio.",
  },
];

const QuestionCard = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 42,
    seconds: 27,
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answerObject, setAnswerObject] = useState({
    domain: "design",
    answers: {
      mcqs: [],
      descriptive: [],
      fileUploads: [],
    },
    behaviorAnalysis: {},
  });
  const analyticsRef = useRef();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (optionIndex) => {
    const question = examData[currentQuestion - 1];
    const answer = `Option ${String.fromCharCode(65 + optionIndex)}`;
    setAnswerObject((prev) => {
      const updatedMcqs = prev.answers.mcqs.filter(
        (mcq) => mcq.questionId !== question.questionId
      );
      updatedMcqs.push({
        questionId: question.questionId,
        answer,
        type: "mcq",
      });
      return { ...prev, answers: { ...prev.answers, mcqs: updatedMcqs } };
    });
  };

  const handleDescriptiveAnswer = (answerText) => {
    const question = examData[currentQuestion - 1];
    setAnswerObject((prev) => {
      const updatedDescriptive = prev.answers.descriptive.filter(
        (desc) => desc.questionId !== question.questionId
      );
      updatedDescriptive.push({
        questionId: question.questionId,
        answer: answerText,
        type: "descriptive",
      });
      return {
        ...prev,
        answers: { ...prev.answers, descriptive: updatedDescriptive },
      };
    });
  };

  const handleFileUpload = (file) => {
    const question = examData[currentQuestion - 1];
    setAnswerObject((prev) => {
      const updatedFileUploads = prev.answers.fileUploads.filter(
        (upload) => upload.questionId !== question.questionId
      );
      updatedFileUploads.push({
        questionId: question.questionId,
        file,
        type: "file",
      });
      return {
        ...prev,
        answers: { ...prev.answers, fileUploads: updatedFileUploads },
      };
    });
  };

  const renderQuestionButtons = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, index) => {
      const questionNumber = start + index;
      let buttonClass = styles.questionButton;
      if (questionNumber === currentQuestion) {
        buttonClass += ` ${styles.current}`;
      }
      return (
        <button
          key={questionNumber}
          className={buttonClass}
          onClick={() => setCurrentQuestion(questionNumber)}
        >
          {questionNumber}
        </button>
      );
    });
  };

  const renderAnswerField = () => {
    const question = examData[currentQuestion - 1];
    if (question.type === "mcq") {
      return question.options.map((option, index) => (
        <label key={index} className={styles.answerOption}>
          <input
            type="radio"
            name="answer"
            value={`Option ${String.fromCharCode(65 + index)}`}
            checked={
              answerObject.answers.mcqs.find(
                (mcq) => mcq.questionId === question.questionId
              )?.answer === `Option ${String.fromCharCode(65 + index)}`
            }
            onChange={() => handleAnswerSelect(index)}
          />
          {option}
        </label>
      ));
    } else if (question.type === "des") {
      return (
        <textarea
          className={styles.textArea}
          placeholder="Write your answer here..."
          onChange={(e) => handleDescriptiveAnswer(e.target.value)}
        />
      );
    } else if (question.type === "file") {
      return (
        <input
          type="file"
          className={styles.fileInput}
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
      );
    }
    return null;
  };
  // async function handleSubmit() {
  //   const behaviorAnalysis = analyticsRef.current.getCurrentAnalysis();
  //   setAnswerObject((prev) => ({ ...prev, behaviorAnalysis }));
  //   console.log(answerObject);
  //   try {
  //     const response = await fetch("http://localhost:8000/api/exam/submit/", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //       },
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       navigate("/exam-complete");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting exam:", error);
  //   }
  // }

  async function handleSubmit() {
    const behaviorAnalysis = analyticsRef.current.getCurrentAnalysis();

    // Create FormData instance
    const formData = new FormData();

    // Prepare exam data structure
    const examData = {
      userId: "Salman@gmail.com", // Add user email from auth context
      domain: answerObject.domain,
      answers: {
        mcqs: answerObject.answers.mcqs,
        descriptive: answerObject.answers.descriptive,
        domainSpecific: {},
      },
      behaviorAnalysis,
    };

    // Handle file uploads
    if (answerObject.answers.fileUploads.length > 0) {
      const fileUpload = answerObject.answers.fileUploads[0]; // Get first file
      formData.append("designFile", fileUpload.file);
      examData.answers.domainSpecific = {
        designFile: {
          description: "", // Add description if needed
          questionId: fileUpload.questionId,
        },
      };
    }

    // Append JSON data
    console.log(examData);
    formData.append("examData", JSON.stringify(examData));
    var str = JSON.stringify(examData);
    console.log(str)
    try {
      const response = await fetch("http://localhost:8000/api/exam/submit/", {
        method: "POST",
        headers: {
          Authorization: ` Bearer ${localStorage.getItem("authToken")}`, // Use dynamic token
        },
        body: { examData: str },
      });

      if (response.ok) {
        navigate("/exam-complete");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  }
  return (
    <div className={styles.container}>
      <KeystrokeAnalytics ref={analyticsRef} />
      <FaceYawDetection />
      <header className={styles.header}>
        <h1 className={styles.title}>Online Test - Freelancing</h1>
        <div className={styles.timer}>
          Time Left: {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.questionSection}>
          <h2 className={styles.questionHeader}>Question {currentQuestion}</h2>
          <p className={styles.questionText}>
            {examData[currentQuestion - 1].title}
          </p>
          <form className={styles.answerForm}>{renderAnswerField()}</form>
          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(1, prev - 1))
              }
            >
              Previous
            </button>
            <button
              className={styles.navButton}
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(examData.length, prev + 1)
                )
              }
            >
              Next
            </button>
          </div>
        </section>
        <aside className={styles.questionStatus}>
          <h3>Questions</h3>
          <div className={styles.questionGrid}>
            {renderQuestionButtons(1, examData.length)}
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
