import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/card.css";

const DraftPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [players1, setPlayers1] = useState([]);
  const [players2, setPlayers2] = useState([]);
  const [players3, setPlayers3] = useState([]);
  const [players4, setPlayers4] = useState([]);
  const [players5, setPlayers5] = useState([]);

  const [selected, setSelected] = useState([null, null, null, null, null]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${backend}/provide_draft`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers1(data.players[0]);
        setPlayers2(data.players[1]);
        setPlayers3(data.players[2]);
        setPlayers4(data.players[3]);
        setPlayers5(data.players[4]);
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

  const createDraft = async () => {
    if (selected.includes(null)) {
      setError("Must select one player in each row before moving on.");
      return;
    } else {
      console.log(selected)
      const response = await fetch(`${backend}/create_draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player_ids: selected }),
      });

      const data = response.json();
      if (data.status === 400) {
        setError("There was an error creating your draft. Please try again.");
      } else {
        setError("");
        navigate("/post_draft");
      }
    }
  };

  const playerItems1 = players1.map((player) => (
    <li key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[0] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, 0)}
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

  const playerItems2 = players2.map((player) => (
    <li key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[1] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, 1)}
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

  const playerItems3 = players3.map((player) => (
    <li key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[2] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, 2)}
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

  const playerItems4 = players4.map((player) => (
    <li key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[3] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, 3)}
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

  const playerItems5 = players5.map((player) => (
    <li key={player.id}>
      <div
        className="card"
        id={`${player.id === selected[4] ? "selected" : ""}`}
        onClick={() => handleCardClick(player.id, 4)}
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
      <ul>{playerItems1}</ul>
      <ul>{playerItems2}</ul>
      <ul>{playerItems3}</ul>
      <ul>{playerItems4}</ul>
      <ul>{playerItems5}</ul>
      <button onClick={createDraft}>Continue</button>
      {error && <p> Error: {error} </p>}
    </div>
  );
};

export default DraftPage;
