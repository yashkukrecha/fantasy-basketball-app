import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PostDraftPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [success, setSuccess] = useState(0);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (auth.user == null) {
      navigate("/");
    } else {
      fetch(`${backend}/get_latest_draft`, {
        method: "POST", // not technically a POST request, but required to allow body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: auth.user.id }),
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
    }
  }, []);

  const playerItems = players.map((player) => (
    <li key={player.id}>
      <div
        className="card"
      >
        <h4> {player.player_name} </h4>
        <p> {player.team_name} </p>
        <p>
          {" "}
          {player.player_age} | {player.player_height.toFixed(1)} cm |{" "}
          {player.player_weight.toFixed(1)} kgs{" "}
        </p>
      </div>
    </li>
  ));

  return (
    <div>
      <h1> Post Draft </h1>
      <ul>{playerItems}</ul>
      <p> Success level: {success.toFixed(1)} </p>
      <button onClick={() => navigate("/dashboard")}> Back to Dashboard</button>
    </div>
  );
};

export default PostDraftPage;
