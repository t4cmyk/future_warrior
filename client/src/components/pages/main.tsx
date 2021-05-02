import React from "react";
import { Gameboard } from "../gameBoard";

export function Main() {
  return (
    <>
      <h1>Missionen</h1>
      <br />
      <br />
      <Gameboard />
      <a href="/#/Planet">
        <button>Unsere Edre</button>
      </a>
      <a href="/#/Missions">
        <button>Missionen</button>
      </a>
      <a href="/#/Teams">
        <button>Teams</button>
      </a>
      <a href="/#/Chat">
        <button>Chat</button>
      </a>
    </>
  );
}
