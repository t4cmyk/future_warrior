import { Request, Response } from "express";


export async function missionHandler(req: Request, resp: Response) {
	const createMission = req.body;

	
	resp.sendStatus(200);
}
