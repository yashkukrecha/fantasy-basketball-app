import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <h1> Home </h1>
      <button onClick={() => navigate('/login')}> Login </button>
      <button onClick={() => navigate('/register')}> Register </button>
    </div>
  );
};

export default HomePage;
