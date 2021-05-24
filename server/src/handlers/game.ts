import { Request, Response } from "express";
import { getAllTeamScores } from "../database/score";

const models = [
	"/models/player-blue.glb",
	"/models/player-purple.glb",
	"/models/player-red.glb",
	"/models/player-yellow.glb",
];
const radiusOffsets = [-2, 2, -4, 4];

const calcPoly = (coefs: number[], pos: number) => {
	let factor = pos;
	return coefs.reduce((prev, coef) => {
		const next = prev + coef * factor;
		factor *= pos;
		return next;
	});
};

const anglePoly = [-3.5744454867309372e-2, 8.9583472024692079e-2];
const radiusPoly = [
	9.6782875101673611e1, -2.213185722071942e-2, -4.3885400281670449e-3,
];

function getFigureModel(
	team: number,
	score: number,
	figureCount: Map<number, number>
) {
	const angle = calcPoly(anglePoly, score);

	const figureAtThisPos = figureCount.get(score) || 0;
	const radiusOffset = figureAtThisPos
		? radiusOffsets[(figureAtThisPos - 1) % radiusOffsets.length]
		: 0;
	figureCount.set(score, figureAtThisPos + 1);
	const radius = calcPoly(radiusPoly, score) + radiusOffset;

	const x = radius * Math.sin(angle);
	const y = -9.3 + score * 0.3 - (Math.sin(score * Math.PI) + 1.0) * 0.4;
	const z = radius * Math.cos(angle);
	return {
		model: models[team % models.length],
		posX: x,
		posY: y,
		posZ: z,
		children: [],
	};
}

export function gameboardHandler(req: Request, resp: Response) {
	try {
		const figureCount = new Map<number, number>();
		const scores = getAllTeamScores();
		const teams = scores.map((entry) => {
			return getFigureModel(entry.team, entry.score, figureCount);
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
