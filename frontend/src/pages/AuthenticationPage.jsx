import React from 'react';
import { useSignIn, useAuth } from "@clerk/clerk-react";

const AuthenticationPage = () => {
  const { signIn } = useSignIn();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      const result = await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/dashboard",
      });

      // Get the token after successful authentication
      const token = await getToken();
      
      // Send token to your backend
      const response = await fetch('http://localhost:8000/api/user/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend');
      }

    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Welcome</h2>
            <p className="text-gray-600 mt-2">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
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