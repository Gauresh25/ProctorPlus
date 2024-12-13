import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WebcamCapture from "./WebcamCapture";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleImageCapture = (imageSrc) => {
    setCapturedImage(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const submitData = isLogin
      ? { ...formData, image: capturedImage }
      : formData;

    try {
      const response = await fetch(
        ` /api/auth/${isLogin ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Authentication failed");
      }

      if (responseData.data && responseData.data.token) {
        localStorage.setItem("authToken", responseData.data.token);
        setUser(responseData.data.user);
        navigate("/test");
      } else {
        throw new Error("Invalid server response format");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="s3 w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          ProctorPlus
        </h1>
        <p className="text-xl text-gray-600">Welcome to ProctorPlus</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-1">
            <input
              type="email"
              value={formData.email}
              required
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-[#4fd1c5] bg-transparent placeholder-gray-400"
              placeholder="Email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {isLogin && (
            <>
              <div className="space-y-1">
                <input
                  type="tel"
                  value={formData.phone}
                  required
                  className="w-full px-4 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-[#4fd1c5] bg-transparent placeholder-gray-400"
                  placeholder="Phone Number"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <WebcamCapture onImageCapture={handleImageCapture} />
            </>
          )}

          <div className="space-y-1">
            <input
              type="password"
              required
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-[#4fd1c5] bg-transparent placeholder-gray-400"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-sm text-[#4fd1c5] hover:text-[#45b8ad]">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Sign Up" : "Sign In"}
        </button>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm">
          {!isLogin ? "Not a Member? " : "Already a Member? "}
          <button
            type="button"
            className="text-[#4fd1c5] hover:text-[#45b8ad] font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {!isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
