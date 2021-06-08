import { Request, Response } from "express";

export enum GamePhase {
	Signup,
	Preparation,
	Running,
	Finished,
}

interface GameState {
	phase: GamePhase;
	nextPhase: Date;
}

export function getCurrentGameState() {
	const state: GameState = {
		phase:
			Date.now() > 1623175200 * 1000 ? GamePhase.Finished : GamePhase.Running,
		nextPhase: new Date(),
	};
	return state;
}

export function getStatusHandler(req: Request, resp: Response) {
	const state = getCurrentGameState();
	resp.status(200).json(state);
}
