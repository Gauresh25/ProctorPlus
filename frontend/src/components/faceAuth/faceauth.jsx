
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FaceAuthSystem = ({ examName, referenceImage, setAuth }) => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Awaiting Input...");

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  // Match faces
  const handleMatchFaces = async () => {
    setStatus("Processing...");
    const video = webcamRef.current.video;
    const referenceImg = await faceapi.fetchImage(referenceImage);

    try {
      // Detect face descriptors
      const referenceDescriptor = await faceapi
        .detectSingleFace(referenceImg)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const inputDescriptor = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (referenceDescriptor && inputDescriptor) {
        const distance = faceapi.euclideanDistance(
          referenceDescriptor.descriptor,
          inputDescriptor.descriptor
        );
        if (distance < 0.5) {
          setStatus("Face Matched");
          setAuth(true);
        } else {
          setStatus("Face Not Matched");
          setAuth(false);
          alert("Face not matched");
        }
      } else {
        setStatus("Face Detection Failed");
        alert("Face doesn't match");
      }
    } catch (err) {
      setStatus("Error in face detection");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Section - Webcam */}
      <div style={styles.leftSection}>
        <Webcam
          ref={webcamRef}
          style={styles.webcam}
          videoConstraints={{ width: 640, height: 480 }}
        />
        <button onClick={handleMatchFaces} style={styles.button}>
          Match Face
        </button>
        <p style={styles.status}>{status}</p>
      </div>

      {/* Right Section - Instructions */}
      <div style={styles.rightSection}>
        <h2 style={styles.examName}>{examName}</h2>
        <div style={styles.instructionsContainer}>
          <h3 style={styles.instructionsHeading}>Instructions:</h3>
          <ul style={styles.instructions}>
            <li>Make sure you do not move the camera at all.</li>
            <li>
              Ensure proper lighting for the camera to capture your face
              clearly.
            </li>
            <li>Sit straight and face the camera directly.</li>
            <li>Maintain a neutral expression during the process.</li>
            <li>Do not look away or cover your face during verification.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Updated Inline Styles
const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "#f9f9f9",
  },
  leftSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginRight: "20px",
  },
  webcam: {
    width: "100%",
    height: "75%",
    borderRadius: "8px",
    objectFit: "cover",
    backgroundColor: "#000", // For black placeholder effect
  },
  button: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#4FD1C5", // Teal button color
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease",
  },
  status: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
  },
  rightSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    background: "linear-gradient(135deg, #4FD1C5, #3BB9A3)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  instructionsContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  examName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: "20px",
    textAlign: "center",
  },
  instructionsHeading: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4FD1C5",
    marginBottom: "10px",
  },
  instructions: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.8",
    paddingLeft: "20px",
    margin: "0",
    listStyleType: "disc",
    listStylePosition: "inside",
  },
};


export default FaceAuthSystem;

