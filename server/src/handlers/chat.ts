import { Request, Response } from "express";
import { addChatMsg, getChatForTeam } from "../database/chat";
import { getTeamIDFromUserId } from "../database/team";

export function postChatMsgHandler(req: Request, resp: Response) {
	if (typeof req.body !== "string") throw new Error();
	const data = addChatMsg(req.currentUser.id, req.body);
	if (!data) resp.sendStatus(500);
	else resp.status(200).json(data);
}

export function getChatHandler(req: Request, resp: Response) {
	const teamId = getTeamIDFromUserId(req.currentUser.id);
	if (!teamId) {
		resp.sendStatus(500);
		return;
	}
	const data = getChatForTeam(teamId);
	resp.status(200).json(data);
}
