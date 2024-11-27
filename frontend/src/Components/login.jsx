import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const t = gsap.timeline();
    t.to(".sign-in-title", {
      x: 10,
      opacity: 1,
      duration: 1,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Only include phone if registering
    const submitData = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/${isLogin ? "register" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Authentication failed");
      }

      // Check the nested structure based on your views.py
      if (responseData.data && responseData.data.token) {
        localStorage.setItem("authToken", responseData.data.token);
        setUser(responseData.data.user);
        navigate("/exam");
      } else {
        throw new Error("Invalid server response format");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="s3">
      <div className="sign-header-section">
        <div className="sign-in-title">Heyy, Welcome Back!</div>
      </div>
      <div className="sign-buttons">
        <a href="#" className="login-w-button">
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="google-logo"
          />
          <span>Sign in with Google</span>
        </a>
        <a href="#" className="login-w-button">
          <img
            width="18"
            height="18"
            src="https://img.icons8.com/ios-filled/50/mac-os.png"
            alt="mac-os"
          />
          <span>Sign in with Apple</span>
        </a>
      </div>
      <div className="slice-container">
        <div className="slice-text-c">
          <div className="slicer"></div>
          <div className="slice-text">Or with email</div>
        </div>
      </div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          required
          placeholder="Email"
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
        />
        {isLogin && (
          <input
            type="tel"
            value={formData.phone}
            required
            placeholder="Phone Number"
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
            }}
          />
        )}
        <input
          type="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <a href="#" className="alt-f">
          Forgot Password ?
        </a>
        <button
          type="submit"
          className="hover:rounded-[2vw] rounded-[1vw]"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Sign Up" : "Sign In"}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="alt-f-full">
          {!isLogin ? "Not a Member" : "Already a Member"}
          <button
            type="button"
            className="p-[.2vw] hover:rounded-[2vw] transition-all w-full duration-1 ease-out border-blue-300 hover:border-b alt-f ml-[0.2vw]"
            onClick={() => setIsLogin(!isLogin)}
          >
            {!isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;