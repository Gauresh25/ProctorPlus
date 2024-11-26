import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
var count = 0;
var nonecount = 0;
var multiplecount = 0;
const FaceYawDetection = () => {
  const videoRef = useRef(null);
  let yawInterval = null;
  let phoneDetectionInterval = null;
  const [sus, setsus] = useState("");
  useEffect(() => {
    // Load models for face-api.js
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
      yawInterval = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks();
        if (detections && detections.length == 1) {
          const landmarks = detections[0].landmarks;

          // Get key points for yaw detection
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const nose = landmarks.getNose();
          multiplecount = 0;
          nonecount = 0;
          // Calculate yaw using horizontal positions
          const noseX = nose[3].x; // Tip of the nose
          const leftEyeX = leftEye[0].x;
          const rightEyeX = rightEye[3].x;

          // Calculate relative position
          const leftDistance = Math.abs(noseX - leftEyeX);
          const rightDistance = Math.abs(noseX - rightEyeX);

          let yawDirection = "Looking Straight";
          const THRESHOLD = 15;

          if (rightDistance - leftDistance > THRESHOLD) {
            yawDirection = "Looking Left";
            count++;
          } else if (leftDistance - rightDistance > THRESHOLD) {
            yawDirection = "Looking Right";
            count++;
          } else {
            count = 0;
          }
          if (count > 3) {
            setsus("looking here and there");
            alert("looking here and there");
          }
          console.log(count);
          console.log(`Yaw Direction: ${yawDirection}`);
        } else if (detections.length > 1) {
          multiplecount++;
          if (multiplecount > 4) {
            alert("multiple found");
          }
        } else {
          nonecount++;
          if (nonecount > 4) {
            alert("none found");
          }
        }
      }, 1000);
    };

    loadModels();
    startVideo();

    // Cleanup function to clear intervals and stop video stream
    return () => {
      if (yawInterval) {
        clearInterval(yawInterval);
      }
      if (phoneDetectionInterval) {
        clearInterval(phoneDetectionInterval);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  return (
    <div>
      <video
        ref={videoRef}
        style={{
          width: "640px",
          height: "480px",
        }}
      />
    </div>
  );
};

export default FaceYawDetection;
