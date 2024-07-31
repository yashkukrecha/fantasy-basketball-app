import { React, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import LoadingIcons from "react-loading-icons";
import { useNavigate } from "react-router-dom";
import BarChart from "./BarChart";
import "./styles/player.css";

const PlayerPage = (props) => {
  const backend = process.env.REACT_APP_BACKEND_URL;
  const index = props.index;
  const [player, setPlayer] = useState(null);
  const [lastSeason, setLastSeason] = useState([]);
  const [nextSeason, setNextSeason] = useState([]);
  const [success, setSuccess] = useState(0.0);

  useEffect(() => {
    fetch(`${backend}/get_player`, {
      method: "POST", // not technically a POST request, but required to allow body
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ player_id: index }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPlayer(data.player);
        // last season stats
        var last = [];
        last.push(data.player.points.toFixed(1));
        last.push(data.player.rebounds.toFixed(1));
        last.push(data.player.assists.toFixed(1));
        last.push(data.player.games_played.toFixed(1));
        setLastSeason(last);
        // next season predictions
        var next = [];
        next.push(data.player.points_pred.toFixed(1));
        next.push(data.player.rebounds_pred.toFixed(1));
        next.push(data.player.assists_pred.toFixed(1));
        next.push(data.player.games_pred.toFixed(1));
        setNextSeason(next);
        // success
        var succ =
          (Number(next[0]) + Number(next[1]) + Number(next[2])) *
          Number(next[3]);
        setSuccess(succ.toFixed(1));
      });
  }, []);

  if (!player) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        id="full-screen"
      >
        <LoadingIcons.ThreeDots />
      </div>
    );
  }

  return (
    <div className="column-container" id="full-screen">
      <button
        className="button"
        id="close-button"
        onClick={() => props.setTrigger(false)}
      >
        <FontAwesomeIcon icon={faXmark} style={{ background: "transparent" }} />
      </button>
      <h1 id="fullscreen-title">{player.player_name}</h1>
      <p> {player.team_name} </p>
      <p>
        {player.player_age} | {player.player_height.toFixed(1)} cm |{" "}
        {player.player_weight.toFixed(1)} kgs
      </p>
      <p>Success: {success}</p>
      <br></br>
      <div
        style={{
          width: "100%",
          height: "50%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BarChart
          id="bar"
          lastSeasonStats={lastSeason}
          nextSeasonStats={nextSeason}
        />
      </div>
    </div>
  );
};

export default PlayerPage;
