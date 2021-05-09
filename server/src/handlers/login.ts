import { Request, Response } from "express";
import { isValidLoginInfo, loginUser } from "../database/login";
import jwt from "jsonwebtoken";
import { getAccessTokenSecret } from "../util";
import { createUserToken } from "../authentication";

export async function loginUserHandler(req: Request, resp: Response) {
	const loginInfo = req.body;

	if (!isValidLoginInfo(loginInfo)) {
		resp.sendStatus(400);
		return;
	}

	const userId = await loginUser(loginInfo);
	if (userId > 0) {
		const accessToken = createUserToken(loginInfo, userId);
		resp.send(accessToken);
	} else resp.status(401).send("Username or password incorrect");
}
