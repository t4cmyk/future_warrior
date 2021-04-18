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

	if (await loginUser(loginInfo)) {
		const accessToken = createUserToken(loginInfo);
		resp.json({
			accessToken,
		});
	} else resp.status(401).send("Username or password incorrect");
}
