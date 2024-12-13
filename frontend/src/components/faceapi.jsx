import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";

var count = 0;
var nonecount = 0;
var multiplecount = 0;
const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
      <h3 className="text-lg font-semibold text-red-600 mb-4">
        Face Detection Warning
      </h3>
      <p className="text-gray-700 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
      >
        Acknowledge
      </button>
    </div>
  </div>
);

const FaceYawDetection = () => {
  const videoRef = useRef(null);
  let yawInterval = useRef(null);
  let yawFunction = useRef(null);
  const [sus, setsus] = useState(false);
  const [violations, setViolations] = useState(0);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalAcknowledged, setIsModalAcknowledged] = useState(true);
  const [initial, setInitial] = useState(true);
  const navigate = useNavigate();
  const maxViolations = 7;

  const handleViolation = (message) => {
    setViolations((prev) => {
      const newCount = prev + 1;
      if (newCount >= maxViolations) {
        cleanup();
        setModalMessage(
          "Multiple Face violations detected. Exam will be terminated."
        );
        navigate("/exam-terminated");
        return newCount;
      }
      setModalMessage(
        `${message} Warning ${newCount}/${maxViolations}`
      );
      setIsModalAcknowledged(false); // Prevent immediate re-trigger
      return newCount;
    });
  };

  function stoptimeout() {
    if (yawInterval.current) {
      clearInterval(yawInterval.current);
      yawInterval.current = null;
    }
  }

  function resumetimeout() {
    if (yawInterval.current == null && yawFunction.current) {
      yawFunction.current();
    }
  }

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Path to face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        detectYaw();
      };
    };

    const detectYaw = async () => {
      const options = new faceapi.TinyFaceDetectorOptions();
      setInitial(false);
      yawInterval.current = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks();
        console.log("hi");
        if (detections && detections.length === 1) {
          const landmarks = detections[0].landmarks;
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const nose = landmarks.getNose();
          multiplecount = 0;
          nonecount = 0;

          const noseX = nose[3].x;
          const leftEyeX = leftEye[0].x;
          const rightEyeX = rightEye[3].x;

          const leftDistance = Math.abs(noseX - leftEyeX);
          const rightDistance = Math.abs(noseX - rightEyeX);

          const THRESHOLD = 20;

          if (rightDistance - leftDistance > THRESHOLD) {
            count++;
          } else if (leftDistance - rightDistance > THRESHOLD) {
            count++;
          } else {
            count = 0;
          }

          if (count > 3) {
            stoptimeout();
            handleViolation("Kindly refrain looking away from the exam screen");

            // setIsModalAcknowledged(false);
          }
        } else if (detections.length > 1) {
          multiplecount++;
          if (!sus && multiplecount > 4) {
            stoptimeout();
            handleViolation("Multiple Faces Detected");
            setsus(true);
            // setIsModalAcknowledged(false);
          }
        } else {
          nonecount++;
          if (!sus && nonecount > 4) {
            stoptimeout();
            handleViolation("No face detected, try again");
            setsus(true);
            // setIsModalAcknowledged(false);
          }
        }
      }, 1000);
    };

    yawFunction.current = detectYaw;
    loadModels();
    startVideo();

    return () => {
      stoptimeout();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (modalMessage === "" && !initial && !isModalAcknowledged) {
      resumetimeout();
      setsus(false);
      count = 0;
      nonecount = 0;
      multiplecount = 0;
    }
  }, [modalMessage, isModalAcknowledged]);

  const closeModal = () => {
    setModalMessage("");
  };

  const cleanup = () => {
    stoptimeout();
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="absolute right-0 bottom-0">
      {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
      <Draggable>
        <video
          ref={videoRef}
          style={{
            width: "40vw",
            height: "40vh",
            borderRadius: 10,
            cursor: "move",
          }}
        />
      </Draggable>
    </div>
  );
};

export default FaceYawDetection;
