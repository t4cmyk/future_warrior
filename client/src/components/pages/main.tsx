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
