import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import Login from "../Components/login";
const Authenticationpage = () => {
  const navigate = useNavigate();
  const { setUser, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    const t = gsap.timeline();

    t.to(".intro-title", {
      y: -10,
      opacity: 1,
      duration: 0.5,
      scale: 1.05,
    });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/auth/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("authToken", data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-column s1">
        <div className="sign-column-face s2">
          <Login />
        </div>
      </div>

      <div className="sign-column w2">
        <div className="intro-p">
          <div className="canvas-logo"></div>

          <div className="intro-content">
            <div className="intro-title">Welcome To Proctor Plus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticationpage;
