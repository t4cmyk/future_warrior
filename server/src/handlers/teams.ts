import { Request, Response } from "express";
import { getLatestFeedback } from "../database/stats";

export function handleTeamsData(req: Request, resp: Response) {
	const feedback = getLatestFeedback();
	resp.status(200).json({ feedback: feedback });
}
