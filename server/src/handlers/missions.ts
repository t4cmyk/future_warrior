import { Request, Response } from "express";
import { getDailyMissions } from "../database/missions";
import { getTeamIDFromUserId } from "../database/team";

export async function missionsHandler(req: Request, resp: Response) {
	try {
		const userId = req.currentUser.id;
		const teamId = getTeamIDFromUserId(userId);
		if (teamId == null) throw new Error();

		let result = getDailyMissions(teamId);
		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}
