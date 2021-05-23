import { Request, Response } from "express";
import { getAllTeamScores } from "../database/score";

function getFigureModel(score: number) {
	const angle = (score * 1.14 - 0.3) / (2 * Math.PI);
	const radius = Math.max(0, 100 - score * 0.5);
	const x = radius * Math.sin(angle);
	const y = score * 0.75 - 9.5;
	const z = radius * Math.cos(angle);
	return {
		model: "/models/player.glb",
		posX: x,
		posY: y,
		posZ: z,
		children: [],
	};
}

export function gameboardHandler(req: Request, resp: Response) {
	try {
		const scores = getAllTeamScores();
		const teams = scores.map((entry) => {
			const [team, score] = entry;
			return getFigureModel(score);
		});

		const result = {
			model: "/models/board.glb",
			children: teams,
		};
		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}
