import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles/card.css";

const Dashboard = () => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, logout, login } = useAuth();
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    if (!auth.user) {
      // Check to see if user is logged in
      fetch(`${backend}/@me`, {
        credentials: "include",
      }).then((response) => {
        if (response.status !== 200) {
          navigate("/");
          return;
        } else {
          login(response.json().user);
        }
      });
    }

    // Get all the drafts for the user
    fetch(`${backend}/get_all_drafts`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDrafts(data.drafts);
      });
  }, []);

  const handleLogout = async () => {
    await fetch(`${backend}/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/");
  };

  const draftItems = drafts.map((draft) => (
    <li key={draft.id}>
      <div
        onClick={() => navigate("/post_draft", { state: { id: draft.id } })}
        style={{ cursor: "pointer" }}
      >
        <p>Draft Success: {draft.success.toFixed(1)}</p>
      </div>
    </li>
  ));

  return (
    <div className="column-container">
      <h1> Dashboard </h1>
      {auth.user && <h3> {auth.user.username}'s drafts: </h3>}
      <p>(Click on a draft to learn more)</p>
      <br></br>
      <ul className="draftul">{draftItems}</ul>
      <div>
        <button onClick={() => navigate("/draft")}> Create a draft </button>
        <button onClick={handleLogout}> Logout </button>
      </div>
    </div>
  );
};

export default Dashboard;
