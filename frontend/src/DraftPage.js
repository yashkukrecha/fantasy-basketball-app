import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const DraftPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [players, setPlayers] = useState([[]]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([null, null, null, null, null]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.user) {
      navigate("/");
      return;
    }
    // Randomly generate the draft class
    fetch(`${backend}/provide_draft`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data.players);
      });
  }, []);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const handleCardClick = (id, index) => {
    var selectedPlayers = [...selected];
    selectedPlayers[index] = id;
    setSelected(selectedPlayers);
  };

  const nextStage = () => {
    if (selected[index] == null) {
      setError("Must select a player");
      return;
    } else {
      setError("");
      setIndex(index + 1);
    }
  };

  const createDraft = async () => {
    if (selected.includes(null)) {
      setError("Must select one player in each row before moving on.");
      return;
    } else {
      const response = await fetch(`${backend}/create_draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ player_ids: selected }),
      });

      if (response.status !== 201) {
        setError("There was an error creating your draft. Please try again.");
      } else {
        const data = await response.json();
        console.log(data);
        setError("");
        navigate("/post_draft", { state: { id: data.draft_id } });
      }
    }
  };

  const handleLeave = () => {
    if (
      window.confirm("Your draft will be lost if you return to the dashboard.")
    ) {
      navigate("/dashboard");
    }
  };

  const playerItems = players[index].map((player) => (
    <li style={{ width: "20%" }} key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[index] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, index)}
      >
        <h3> {player.player_name} </h3>
        <p> {player.team_name} </p>
        <p>
          {player.player_age} | {player.player_height.toFixed(1)} cm |{" "}
          {player.player_weight.toFixed(1)} kgs
        </p>
        <br></br>
        <p>
          PPG: {player.points.toFixed(1)} (
          {(player.shooting_percent * 100).toFixed(1)}%)
        </p>
        <p>APG: {player.assists.toFixed(1)}</p>
        <p>RPG: {player.rebounds.toFixed(1)}</p>
        <p>Games played: {player.games_played.toFixed(1)}</p>
        <p>Net rating: {player.net_rating.toFixed(1)}</p>
      </div>
    </li>
  ));

  return (
    <div className="column-container">
      <h1>Draft Page</h1>
      <ul className="playersul">{playerItems}</ul>
      {error && <p className="error"> Error: {error} </p>}
      <div style={{ marginTop: "1%" }}>
        {index < 4 ? (
          <button onClick={nextStage}>Next</button>
        ) : (
          <button onClick={createDraft}>Complete Draft</button>
        )}
        <button onClick={handleLeave}>Dashboard</button>
      </div>
    </div>
  );
};

export default DraftPage;
