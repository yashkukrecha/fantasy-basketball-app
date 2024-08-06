import { React, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = (props) => {
  const navigate = useNavigate();
  return (
    <div className="column-container" style={{ overflow: "hidden" }}>
      <h1 id="title"> HoopVision </h1>
      <p>A fantasy basketball application that predicts your drafted team's future.</p>
      <div className="row-container">
        <button onClick={() => navigate("/login")}> Login </button>
        <button onClick={() => navigate("/register")}> Register </button>
      </div>
      <img
        src={require("./icons/basketball.png")}
        alt="basketball"
        id="home-icon"
      />
    </div>
  );
};

export default HomePage;
