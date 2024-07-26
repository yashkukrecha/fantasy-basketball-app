import { React, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingIcons from "react-loading-icons";

const PostDraftPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, login } = useAuth();
  const { state } = useLocation();
  const [success, setSuccess] = useState(0);
  const [players, setPlayers] = useState([]);

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

    // If user tries to manually navigate to this page
    if (!state) {
      navigate("/dashboard");
      return;
    }

    // Get one specific draft for the user
    fetch(`${backend}/get_draft`, {
      method: "POST", // not technically a POST request, but required to allow body
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ draft_id: state.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        var temp_players = [];
        temp_players.push(data.draft.player1);
        temp_players.push(data.draft.player2);
        temp_players.push(data.draft.player3);
        temp_players.push(data.draft.player4);
        temp_players.push(data.draft.player5);
        setPlayers(temp_players);
        setSuccess(data.draft.success);
      });
  }, []);

  const playerItems = players.map((player) => (
    <li key={player.id}>
      <div className="card">
        <h3> {player.player_name} </h3>
        <p> {player.team_name} </p>
        <p>
          {player.player_age} | {player.player_height.toFixed(1)} cm |{" "}
          {player.player_weight.toFixed(1)} kgs
        </p>
        <br></br>
        <p>PPG prediction: {player.points_pred.toFixed(1)}</p>
        <p>APG prediction: {player.assists_pred.toFixed(1)}</p>
        <p>RPG prediction: {player.rebounds_pred.toFixed(1)}</p>
        <p>Games played prediction: {player.games_pred.toFixed(1)}</p>
      </div>
    </li>
  ));

  if (players.length === 0) {
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
    <div>
      <h1> Post Draft </h1>
      <ul className="playersul">{playerItems}</ul>
      <br></br>
      <p> Success level: {success.toFixed(1)} </p>
      <button onClick={() => navigate("/dashboard")}> Back to Dashboard</button>
    </div>
  );
};

export default PostDraftPage;
