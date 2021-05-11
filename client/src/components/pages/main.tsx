import React from "react";
import { Link } from "react-router-dom";
import { Gameboard } from "../gameBoard";

export function Main() {
  return (
    <>
      <h1>Missionen</h1>
      <br />
      <br />
      <Gameboard />
      <Link to="/Planet">
        <button>Unsere Edre</button>
      </Link>
      <Link to="/Missions">
        <button>Missionen</button>
      </Link>
      <Link to="/Teams">
        <button>Teams</button>
      </Link>
      <Link to="/Chat">
        <button>Chat</button>
      </Link>
    </>
  );
}
