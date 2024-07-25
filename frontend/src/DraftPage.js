import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles/card.css";

const DraftPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { auth, login } = useAuth();
  const [players, setPlayers] = useState([[]]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([null, null, null, null, null]);
  const [error, setError] = useState("");

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

  const playerItems = players[index].map((player) => (
    <li key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[index] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, index)}
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
      <h1>Draft Page</h1>
      <ul>{playerItems}</ul>
      {index < 4 && <button onClick={nextStage}>Next</button>}
      {index === 4 && <button onClick={createDraft}>Complete Draft</button>}
      {error && <p> Error: {error} </p>}
      <button onClick={() => navigate("/dashboard")}>
        {" "}
        Back to dashboard{" "}
      </button>
    </div>
  );
};

export default DraftPage;
