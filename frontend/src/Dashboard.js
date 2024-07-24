import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Dashboard = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  useEffect(() => {
    console.log(auth);
    if (auth.user == null) {
      navigate("/");
    }
  }, []);

  const handleLogout = async () => {
    console.log(auth.user);
    const response = await fetch(`${backend}/logout`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Something happened");
    }
    const data = await response.json();
    if (data.status === 200) {
      logout();
      navigate("/");
    }
  };

  return (
    <div>
      <h1> Dashboard </h1>
      {auth.user && <p> {auth.user.username} </p>}
      <button onClick={() => navigate("/draft")}> Create a draft </button>
      <button onClick={handleLogout}> Logout </button>
    </div>
  );
};

export default Dashboard;
