import { useEffect, useState } from "react";
import { sleep } from "../../core/util";

export enum GamePhase {
  Signup,
  Preparation,
  Running,
  Finished,
  Sandbox,
}

interface GameState {
  phase: GamePhase;
  nextPhase: Date;
}

let currentState: GameState;
const updateStateCallbacks: ((state: GameState) => any)[] = [];

const fetchGameState = async () => {
  const resp = await fetch("/status");
  const data = await resp.json();
  data.nextPhase = new Date(data.nextPhase);
  currentState = data;
  updateStateCallbacks.forEach((cb) => cb(data));
};

setInterval(fetchGameState, 60 * 1000);

export function requireGameState() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const loadGameState = async () => {
      let complete = false;
      while (!complete) {
        try {
          await fetchGameState();
          complete = true;
        } catch {
          await sleep(500);
        }
      }
      setLoaded(true);
    };
    loadGameState();
  }, []);
  return loaded;
}

export function useGameState() {
  const [gameState, setGameState] = useState(currentState);
  useEffect(() => {
    updateStateCallbacks.push(setGameState);
    return () => {
      updateStateCallbacks[updateStateCallbacks.indexOf(setGameState)] =
        updateStateCallbacks[updateStateCallbacks.length - 1];
      updateStateCallbacks.pop();
    };
  }, []);
  return gameState;
}
