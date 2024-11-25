import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
var count = 0;

const FaceYawDetection = () => {
  const videoRef = useRef(null);
  let yawInterval = null;
  let phoneDetectionInterval = null;
  const [model, setModel] = useState(null);
  const startPhoneDetection = async (model) => {};
  useEffect(() => {
    // Load models for face-api.js
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Path to face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };

    // Load COCO-SSD model using TensorFlow.js
    // const loadPhoneDetectionModel = async () => {
    //   try {
    //     const model = await cocoSSDLoad();
    //     console.log("model loaded")
    //     startPhoneDetection(model);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

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
          .detectSingleFace(videoRef.current, options)
          .withFaceLandmarks();
        if (detections) {
          const landmarks = detections.landmarks;

          // Get key points for yaw detection
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const nose = landmarks.getNose();

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
          console.log(count);
          if (count > 10) {
            alert("looking here and there");
          }
          console.log(`Yaw Direction: ${yawDirection}`);
        }
      }, 1000);
    };

    loadModels();
    // loadPhoneDetectionModel();
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
  useEffect(() => {
    startPhoneDetection(model);
  }, [model]);
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
