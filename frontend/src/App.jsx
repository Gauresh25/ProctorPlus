import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import AuthenticationPage from "./pages/AuthenticationPage";
import Authenticationpage from "./components/login";
import AuthenticationPage from "./pages/AuthenticationPage";
import ExamInterface from "./pages/ExamInterface";

import PhoneDetectionWithDrag from "./components/faceapi";
// import FaceDetection from "./Components/faceapi";
// import PhoneDetection from "./Components/faceapi";
// import EyeTracking from "./Components/faceapi";
// import EyeMovementTracker from "./Components/faceapi";

import TestPage from "./pages/TestPage";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold mb-4">
                    Welcome to Exam Portal
                  </h1>
                  <a
                    href="/auth"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Login / Register
                  </a>
                </div>
              }
            />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route path="/face" element={<PhoneDetectionWithDrag />} />
            <Route
              path="/dashboard"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold">Welcome to Dashboard!</h1>
                  <p className="mt-2">You're successfully logged in.</p>
                </div>
              }
            />

            <Route path="/test" element={<TestPage />} />

            <Route path="/exam" element={<ExamInterface />} />

            <Route path="/exam-terminated"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                  <h1 className="text-3xl font-bold text-red-600 mb-4">Exam Terminated</h1>
                  <p className="text-gray-700 mb-6">
                    Your exam has been terminated due to multiple violations of exam integrity rules.
                  </p>
                  <div className="space-y-4">
                    <a href="/">
                    <button 
                      
                      className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Return to Home
                    </button>
                    </a>
                  </div>
                </div>
              </div>
              }
              />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
