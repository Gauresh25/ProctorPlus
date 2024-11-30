import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import AuthenticationPage from "./pages/AuthenticationPage";
// import Authenticationpage from "./components/login";
import AuthenticationPage from "./pages/AuthenticationPage";
import PhoneDetectionWithDrag from "./components/faceapi";
import Dashoard from "./pages/Dashoard";
import ExamInterface from "./pages/ExamInterface";
import TestPage from "./pages/TestPage";
import Admin from "./pages/Admin";
import AudioMCQMonitor from "./components/speech/speechrecog";
import img from "./assets/ss.png";
import "./app.css";
import SkillTests from "./Components/skillTest";
import { CheckCircle } from 'lucide-react';

function HomePage() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="logo">
          ProctorPlus
        </Link>
        <nav className="nav-links">
          <Link to="/test">Our tests</Link>
          <a href="#certification">Domains</a>
          <a href="#languages">About Us</a>
          <a href="#languages">Contact Us</a>
        </nav>
        <div className="auth-buttons">
          <a href="/auth">
            <button className="login">Log in</button>
          </a>
          <button className="signup">Sign up</button>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          <div className="text-content">
            <h1>Prove skills, ace tests, and thrive in freelancing!</h1>
            <p>
              You can take the test wherever you are at your convenience and get
              the results immediately.
            </p>
            <div className="hero-buttons">
              <button className="learn-more">Learn more</button>
              <button className="take-test">Take a test</button>
            </div>
          </div>

          <div className="image-content">
            <img src={img} alt="Student Learning" className="hero-image" />
          </div>
        </div>

        <footer className="footer">
          <h2>Best way to start freelancing</h2>
          <p>At ProctorPlus, we use the best and newest methods</p>
        </footer>
      </main>
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route path="/face" element={<PhoneDetectionWithDrag />} />
            <Route path="/dashboard/*" element={<Dashoard />} />
            {/* <Route path="/test" element={<TestPage />} /> */}
            <Route path="/speech" element={<AudioMCQMonitor />} />
            <Route path="/exam/" element={<ExamInterface />} />
            <Route path="/reports" element={<Admin />} />
            <Route path="/test" element={<SkillTests />} />
            <Route path="/dummy" element={<TestPage />} />
            <Route path="/exam" element={<ExamInterface />} />
            <Route path="/exam-complete" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Exam Completed Successfully!
                  </h1>
                  
                  <p className="text-gray-600 mb-8">
                    Thank you for completing the exam. Your responses have been recorded and are being evaluated.
                  </p>

                  <div className="space-y-4">
                    <a href="/">
                    <button
                      onClick={() => navigate('//')}
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Return to Home
                    </button>
                    </a>
                    
                    
                  </div>

                  <p className="mt-6 text-sm text-gray-500">
                    Your results will be available within 24 hours.
                  </p>
                </div>
              </div>
            }
            />
            

            <Route
              path="/exam-terminated"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
                  <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                      Exam Terminated
                    </h1>
                    <p className="text-gray-700 mb-6">
                      Your exam has been terminated due to multiple violations
                      of exam integrity rules.
                    </p>
                    <div className="space-y-4">
                      <a href="/">
                        <button className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
