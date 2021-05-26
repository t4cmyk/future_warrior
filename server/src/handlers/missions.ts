import { Request, Response } from "express";
import { hasPlayerDailyMissionsLeft } from "../database/completeMission";
import { getDailyMissions, getMissionData } from "../database/missions";
import { getTeamIDFromUserId } from "../database/team";

export function queryMissionHandler(req: Request, resp: Response) {
	const missionId = parseInt(req.params.missionId);
	if (isNaN(missionId)) {
		resp.sendStatus(500);
		return;
	}

	const mission = getMissionData(missionId);
	if (!mission) {
		resp.sendStatus(500);
		return;
	}

	resp.status(200).json(mission);
}

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

export async function checkRemainingMissionsHandler(
	req: Request,
	resp: Response
) {
	try {
		const user = req.currentUser.id;
		const team = getTeamIDFromUserId(user);
		if (team == null) throw new Error();

		let result = hasPlayerDailyMissionsLeft(user, team);
		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}
