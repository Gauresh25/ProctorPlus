import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onImageCapture }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);  // Store captured image here

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onImageCapture(imageSrc);
    setCapturedImage(imageSrc);  // Save the captured image to state
  }, [webcamRef, onImageCapture]);

  const retake = () => {
    setCapturedImage(null);  // Reset the captured image
    onImageCapture(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!capturedImage ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg"
          />
          <button
            onClick={capture}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Capture Photo
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <img
            src={capturedImage}  // Use the captured image from state
            alt="captured"
            className="rounded-lg"
          />
          <button
            onClick={retake}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
