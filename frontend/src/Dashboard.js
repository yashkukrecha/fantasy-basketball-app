import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

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
      <div onClick={() => navigate("/post_draft", { state: { id: draft.id } })}>Draft: {draft.success}</div>
    </li>
  ));

  return (
    <div>
      <h1> Dashboard </h1>
      {auth.user && <p> {auth.user.username} </p>}
      <ul>{draftItems}</ul>
      <button onClick={() => navigate("/draft")}> Create a draft </button>
      <button onClick={handleLogout}> Logout </button>
    </div>
  );
};

export default Dashboard;
