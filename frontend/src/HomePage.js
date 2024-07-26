import { React, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";

const HomePage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    fetch(`${backend}/@me`, {
      credentials: "include",
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        const data = response.json();
        login(data.user);
        navigate("/dashboard");
      }
    });
  }, []);

  return (
    <div className="column-container">
      <h1 id="title"> Fantasy Basketball </h1>
      <p> A dynamic application that predicts your drafted team's future.</p>
      <div className="row-container">
        <button onClick={() => navigate("/login")}> Login </button>
        <button onClick={() => navigate("/register")}> Register </button>
      </div>
    </div>
  );
};

export default HomePage;
