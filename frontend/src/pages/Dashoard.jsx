import React from "react";
import DefaultLayout from "../components/DefaultLayout/defaultlayout";
import { Route, Routes } from "react-router-dom";
import Controll from "../components/dashboard/controll";

function Dashboard() {
  return (
    <div>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<Controll />} />
          <Route path="/assignment" element={<>hi</>} />
        </Routes>
      </DefaultLayout>
    </div>
  );
}

export default Dashboard;
