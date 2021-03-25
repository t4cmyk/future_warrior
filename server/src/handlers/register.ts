import { Request, Response } from "express";
import { createUser, isValidUserCreateInfo } from "../database/register";

export async function registerUserHandler(req: Request, resp: Response) {
	const createInfo = req.body;

	if (!isValidUserCreateInfo(createInfo)) {
		resp.sendStatus(400);
		return;
	}

	await createUser(createInfo);
	resp.sendStatus(200);
}
