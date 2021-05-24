import { Request, Response } from "express";
import { getDailyMissions, Sector } from "../database/missions";
import { getHappinessPoints, getTeamLevel } from "../database/score";
import { getSectorsFromTeamId, getTeamIDFromUserId } from "../database/team";

export interface IPlanetInfo {
	level: number;
	sector1: string;
	sector2: string;
	sector3: string;
	happiness: number;
}

export async function planetDataHandler(req: Request, resp: Response) {
	try {
		const userId = req.currentUser.id;
		const teamId = getTeamIDFromUserId(userId);
		if (teamId == null) throw new Error();
		let sectors = getSectorsFromTeamId(teamId);

		let result = {
			level: getTeamLevel(teamId),
			sector1: sectors.sector1,
			sector2: sectors.sector2,
			sector3: sectors.sector3,
			happiness: getHappinessPoints(teamId),
		};
		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}
