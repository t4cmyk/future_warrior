import React from "react";
import { useEffect, useRef } from "react";
import { GameboardGraphics } from "../core/gameBoard";

export function Gameboard() {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const graphics = new GameboardGraphics(divRef.current);
    return () => graphics.dispose();
  });

  return (
    <div className="game-board-space">
      <div className="game-board" ref={divRef}></div>
    </div>
  );
}
