import { Request, Response } from "express";
import {
	completeMission,
	getMissionIdFromDailyId,
	isValidMissionFeedback,
} from "../database/completeMission";
import { getTeamIDFromUserId } from "../database/team";

export async function completeMissionHandler(req: Request, resp: Response) {
	try {
		const userId = req.currentUser.id;
		let dailyMissionId = -1;
		if (req.query.mission)
			dailyMissionId = parseInt(req.query.mission as string);
		const teamId = getTeamIDFromUserId(userId);
		if (teamId == null) throw new Error();
		const missionId = getMissionIdFromDailyId(dailyMissionId, teamId);
		if (missionId <= 0) throw new Error();
		const feedback = req.body;
		if (!isValidMissionFeedback(feedback)) throw new Error();
		completeMission(userId, dailyMissionId, missionId, teamId, feedback);
		resp.sendStatus(200);
	} catch {
		resp.sendStatus(500);
	}
}
