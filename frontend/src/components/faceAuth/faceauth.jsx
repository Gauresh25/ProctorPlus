import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FaceAuthSystem = ({ examName, referenceImage, setAuth }) => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Awaiting Input...");
  const [loading, setLoading] = useState(true);
  // if (!referenceImage) {
  //   return;
  // }
  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    setLoading(true);
    loadModels();
    setLoading(false);
  }, []);
  if (loading) {
    return <div>loading</div>;
  }
  // Match faces
  const handleMatchFaces = async () => {
    setStatus("Processing...");
    const video = webcamRef.current.video;
    const referenceImg = await faceapi.fetchImage(referenceImage);
    console.log(referenceImage);
    // Detect face descriptors
    try {
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
        console.log(distance);
        if (distance < 0.5) {
          setStatus(distance < 0.5 ? "Face Matched" : "Face Not Matched");
          setAuth(distance < 0.5 ? true : false);
        } else {
          setStatus(distance < 0.5 ? "Face Matched" : "Face Not Matched");
          setAuth(distance < 0.5 ? true : false);
          alert("face not matched");
        }
      } else {
        setStatus("Face Detection Failed");
        alert("face Doesnt Match");
      }
    } catch (err) {
      throw err;
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
        <h3>Instructions:</h3>
        <ul style={styles.instructions}>
          <li>Make sure you do not move the camera at all.</li>
          <li>
            Ensure proper lighting for the camera to capture your face clearly.
          </li>
          <li>Sit straight and face the camera directly.</li>
          <li>Maintain a neutral expression during the process.</li>
          <li>Do not look away or cover your face during verification.</li>
        </ul>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  },
  leftSection: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh",
    width: "45vw",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    padding: "20px",
  },
  webcam: {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  status: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  rightSection: {
    flex: "1",
    padding: "20px",
    height: "70vh",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    marginLeft: "20px",
  },
  examName: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  instructions: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.8",
  },
};

export default FaceAuthSystem;
