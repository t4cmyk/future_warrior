import { Request, Response } from "express";

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

export function getCurrentGameState() {
	const state: GameState = {
		phase:
			Date.now() > 1624372190639 ? GamePhase.Sandbox : GamePhase.Finished,
		nextPhase: new Date(),
	};
	return state;
}

export function getStatusHandler(req: Request, resp: Response) {
	const state = getCurrentGameState();
	resp.status(200).json(state);
}
