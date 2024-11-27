import React, { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import { useParams } from "react-router-dom";
import Faceauth from "../components/faceAuth/faceauth";

function ExamInterface() {
  const { id } = useParams();
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    console.log(id);
    return () => {};
  }, []);

  return <div>{auth ? <Faceauth  /> : <QuestionCard />}</div>;
}

export default ExamInterface;