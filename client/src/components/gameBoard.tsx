import React from "react";
import { useEffect, useRef } from "react";
import { getToken } from "../core/authentication";
import { GameboardGraphics } from "../core/gameBoard";

export function Gameboard() {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const graphics = new GameboardGraphics(divRef.current);
    fetch(`/board?token=${getToken()}`)
      .then((result) => result.json())
      .then((result) => graphics.inputGraphicsData(result));
    return () => graphics.dispose();
  }, []);

  const debugRef = useRef<HTMLInputElement>();

  const onInputDebug = () => {
    try {
      const coords = JSON.parse(debugRef.current.value);
      (window as any).TestModel(coords);
    } catch {}
  };

  return (
    <div className="game-board-space">
      <div className="game-board" ref={divRef}>
        <input
          ref={debugRef}
          style={{ display: "none" }}
          defaultValue={`{"pos": 0}`}
          onChange={onInputDebug}
        />
      </div>
    </div>
  );
}
