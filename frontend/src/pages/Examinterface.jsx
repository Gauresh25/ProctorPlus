import React, { useEffect, useState } from "react";
import QuestionCard from "../Components/QuestionCard";
import { useParams } from "react-router-dom";
import Faceauth from "../Components/faceAuth/faceauth";

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
