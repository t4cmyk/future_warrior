import { Request, Response } from "express";
import { getAllTeamScores, getTotalScoreForTeam } from "../database/score";
import { getTeamIDFromUserId } from "../database/team";

export function teamScoreHandler(req: Request, resp: Response) {
	try {
		const userId = req.currentUser.id;
		const teamId = getTeamIDFromUserId(userId);
		if (teamId == null) throw new Error();

		let score = getTotalScoreForTeam(teamId);
		const result = { score: score };
		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}

export function allTeamScoresHandler(req: Request, resp: Response) {
	try {
		const scores = getAllTeamScores();

		resp.status(200).json(scores);
	} catch {
		resp.sendStatus(500);
	}
}
