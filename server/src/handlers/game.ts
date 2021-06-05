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

const anglePoly = [4.7115890059858501e-2, 8.9391932821537581e-2];
const radiusPoly = [
	9.8057340089914845e1, -4.702033999520765e-1, -1.421116485586682e-3,
	2.6435669277312997e-3, -1.5015714040843254e-4, 3.6796337272804276e-6,
	-4.9298718523646309e-8, 3.8602156233250395e-10, -1.7045732837159821e-12,
	3.0536612898665987e-15, 6.9562405234876874e-18, -4.9113909872355874e-20,
	1.0026924850213402e-22, -7.4691025295758869e-26,
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
	const y = -9.3 + score * 0.265 - (Math.sin(score * Math.PI) + 1.0) * 0.4;
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
