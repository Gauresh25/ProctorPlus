import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthenticationPage from "./pages/AuthenticationPage";
import PhoneDetectionWithDrag from "./Components/faceapi";
import Dashoard from "./pages/Dashoard";
import ExamInterface from "./pages/ExamInterface";
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
            <Route path="/dashboard/*" element={<Dashoard />} />
            <Route path="/test" element={<TestPage />} />

            <Route path="/exam/:id" element={<ExamInterface />} />
            <Route path="/exam-complete" element={<></>} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
