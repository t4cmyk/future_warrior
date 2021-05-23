import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Gameboard } from "../gameBoard";
import { GamePhase, useGameState } from "../hooks/gameState";

export function Main() {
  const state = useGameState();
  if (
    state.phase === GamePhase.Signup ||
    state.phase === GamePhase.Preparation
  ) {
    return <Redirect to="/Tutorial/" />;
  }

  return (
    <>
      <h1>Missionen</h1>
      <br />
      <br />
      <Gameboard />
      <Link to="/Planet">
        <button id={"nav-arrow_Planet"} className={"nav-arrow"}>Unsere Edre</button>
      </Link>
      <Link to="/Missions">
        <button id={"nav-arrow_Missions"} className={"nav-arrow"}>Missionen</button>
      </Link>
      <Link to="/Teams">
        <button id={"nav-arrow_Teams"} className={"nav-arrow"}>Teams</button>
      </Link>
      <Link to="/Chat">
        <button id={"nav-arrow_Chat"} className={"nav-arrow"}>Chat</button>
      </Link>
    </>
  );
}
