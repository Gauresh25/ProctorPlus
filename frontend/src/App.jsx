import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from "@clerk/clerk-react";
import AuthenticationPage from './pages/AuthenticationPage';  

const App = () => {
  const clerkPubKey =  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <div className="min-h-screen bg-gray-50">
        <BrowserRouter>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Exam Portal</h1>
                <a 
                  href="/auth" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Login / Register
                </a>
              </div>
            } />
            
            {/* Authentication Route */}
            <Route path="/auth" element={<AuthenticationPage />} />
            
            {/* Dashboard Route thoda dummy page banaya*/}
            <Route path="/dashboard" element={
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Welcome to Dashboard!</h1>
                <p className="mt-2">You're successfully logged in.</p>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </ClerkProvider>
  );
};

export default App;