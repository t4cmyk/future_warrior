import { Request, Response } from "express";
import { getDailyMissions, Sector } from "../database/missions";
import { getTeamIDFromUserId } from "../database/team";

export interface IPlanetInfo {
    level: number;
    sector1: string;
    sector2: string;
  }

export async function planetHandler(req: Request, resp: Response) {
	try {
		const userId = req.currentUser.id;
		const teamId = getTeamIDFromUserId(userId);
		if (teamId == null) throw new Error();


		let result = {level: 0, sector1: Sector.diet, sector2: Sector.energy};
		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}
