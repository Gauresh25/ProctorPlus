import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Login";

import "../styles/login.css";
import login_img from "../assets/login.png"

const AuthenticationPage = () => {
  useEffect(() => {
    const t = gsap.timeline();
    t.to(".intro-title", {
      y: -10,
      opacity: 1,
      duration: 0.5,
      scale: 1.05,
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <div className="hidden lg:flex w-1/2 bg-[#4fd1c5] p-12 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <img 
              src={login_img} 
              alt="Decorative bird illustration" 
              className="mx-auto"
            />
          </div>
          <h2 className="intro-title text-3xl font-bold text-white mb-4">
            WelcoProctorPlus
          </h2>
          <p className="text-white/90">
            Get you skills assessed and start freenlancing now!
          </p>
          <div className="flex justify-center gap-2 mt-8">
            {/* <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
            <div className="w-2 h-2 rounded-full bg-white opacity-50"></div> */}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <Login />
      </div>
    </div>
  );
};

export default AuthenticationPage;
