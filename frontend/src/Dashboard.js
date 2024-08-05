import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import LoadingIcons from "react-loading-icons";

const Dashboard = () => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [bestDraft, setBestDraft] = useState(0);
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (!auth.user) {
      navigate("/");
      return;
    } else {
      setUsername(auth.user.username);
      setProfilePic(auth.user.profile_pic);
    }

    // Get all the drafts for the user
    fetch(`${backend}/get_all_drafts`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setDrafts(data.drafts);
        if (data.drafts.length !== 0) {
          var highest = data.drafts[0];
          for (var i = 1; i < data.drafts.length; i++) {
            if (data.drafts[i].success > highest.success)
              highest = data.drafts[i];
          }
          setBestDraft(highest.id);
        }
      });
  }, []);

  const deleteDraft = async (id) => {
    if (window.confirm("Do you want to delete this draft?")) {
      fetch(`${backend}/delete_draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ draft_id: id }),
      }).then((response) => {
        if (response.status === 200) {
          window.location.reload();
          return;
        }
      });
    }
  };

  const handleLogout = async () => {
    await fetch(`${backend}/logout`, {
      method: "POST",
      credentials: "include",
    });
    logout();
    navigate("/");
  };

  const draftItems = drafts.map((draft) => (
    <li
      style={{
        display: "flex",
        width: "100%",
        alignItems: "stretch",
        position: "relative",
      }}
      key={draft.id}
    >
      <div style={{ cursor: "pointer", width: "100%" }} className="card">
        <h3
          onClick={() => navigate("/post_draft", { state: { id: draft.id } })}
          style={{ textAlign: "left", margin: "0%" }}
        >
          Draft Success: {draft.success.toFixed(1)}
        </h3>
        {bestDraft === draft.id && (
          <FontAwesomeIcon
            icon={faStar}
            size="2xl"
            style={{
              position: "absolute",
              bottom: "15px",
              right: "20px",
            }}
          />
        )}
        <FontAwesomeIcon
          size="2xl"
          icon={faTrash}
          id="trash-icon"
          style={{ position: "absolute", top: "20px", right: "25px" }}
          onClick={() => deleteDraft(draft.id)}
        />
        <p
          onClick={() => navigate("/post_draft", { state: { id: draft.id } })}
          style={{ textAlign: "left" }}
        >
          {" "}
          {draft.player1.player_name} | {draft.player2.player_name} |{" "}
          {draft.player3.player_name} | {draft.player4.player_name} |{" "}
          {draft.player5.player_name}
        </p>
      </div>
    </li>
  ));

  if (!username) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingIcons.ThreeDots />
      </div>
    );
  }

  return (
    <div className="column-container">
      <h1> Dashboard </h1>
      <img
        src={profilePic || require("./icons/default-pfp.png")}
        alt="user profile"
        id="dashboard-pfp"
        onClick={() => navigate("/profile")}
      />
      <h3> {username}'s drafts: </h3>
      {bestDraft !== 0 && <p>(Click on a draft to learn more)</p>}
      <br></br>
      <ul className="draftul">{draftItems}</ul>
      <br></br>
      <div>
        <button onClick={() => navigate("/draft")}> Create a draft </button>
        <button onClick={handleLogout}> Logout </button>
      </div>
    </div>
  );
};

export default Dashboard;
