import React, { useContext, useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import { useParams } from "react-router-dom";
import Faceauth from "../Components/faceAuth/faceauth";
import { useAuth } from "../context/AuthContext";

function ExamInterface() {
  const { id } = useParams();
  const { user } = useAuth();
  const [User, setUser] = useState({});
  const [auth, setAuth] = useState(false);
  const [image, setImage] = useState("");
  useEffect(() => {
    console.log(image);
  }, [image]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const userData = await response.json();
      setUser(userData);
      setImage("http://localhost:8000" + userData.data.user.profile_image);
      console.log(userData);
      console.log(image);
    }
    fetchData();
  }, []);

  return (
    <div>{!auth ? <Faceauth referenceImage={image} setAuth={setAuth}/> : <QuestionCard />}</div>
  );
}

export default ExamInterface;
