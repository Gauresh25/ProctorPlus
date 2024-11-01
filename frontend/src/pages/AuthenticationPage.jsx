import React from 'react';
import { useSignIn } from "@clerk/clerk-react";
import {  } from "lucide-react";

const AuthenticationPage = () => {
  const { signIn } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/dashboard",
      });
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Card Container */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Welcome</h2>
            <p className="text-gray-600 mt-2">Sign in to continue</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Continue with GitHub
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Redirecting to login...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;