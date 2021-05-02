import { Request, Response } from "express";
import { resolveContent } from "nodemailer/lib/shared";
import { getDailyMissions } from "../database/missions";

export async function missionsHandler(req: Request, resp: Response) {
	try {
		const teamId = req.body.teamId;
		if (teamId == null) throw new Error();

		let result = getDailyMissions(1);
		resp.sendStatus(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}
