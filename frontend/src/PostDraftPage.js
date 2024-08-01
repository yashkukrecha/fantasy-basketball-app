import { React, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingIcons from "react-loading-icons";
import PlayerPage from "./PlayerPage";

const PostDraftPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, login } = useAuth();
  const { state } = useLocation();
  const [success, setSuccess] = useState(0);
  const [players, setPlayers] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
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

  const handleClick = (index) => {
    setClicked(true);
    setIndex(index);
  };

  const playerItems = players.map((player) => (
    <li style={{width: '20%'}}  key={player.id}>
      <div className="card" onClick={() => handleClick(player.id)}>
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
        <p>GP prediction: {player.games_pred.toFixed(1)}</p>
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
      {clicked && <PlayerPage setTrigger={setClicked} index={index}/>}
      <ul className="playersul">{playerItems}</ul>
      <br></br>
      <p> Success level: {success.toFixed(1)} </p>
      <button onClick={() => navigate("/dashboard")}> Back to Dashboard</button>
    </div>
  );
};

export default PostDraftPage;
