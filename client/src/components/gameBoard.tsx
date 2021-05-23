import React from "react";
import { useEffect, useRef } from "react";
import { GameboardGraphics } from "../core/gameBoard";

export function Gameboard() {
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const graphics = new GameboardGraphics(divRef.current);
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
          defaultValue={`{"x":0, "y":0, "z":0}`}
          onChange={onInputDebug}
        />
      </div>
    </div>
  );
}
