import { Request, Response } from "express";
import { isValidLoginInfo, loginUser } from "../database/login";
import jwt from "jsonwebtoken";
import { getAccessTokenSecret } from "../util";

export async function loginUserHandler(req: Request, resp: Response) {
	const loginInfo = req.body;

	if (!isValidLoginInfo(loginInfo)) {
		resp.sendStatus(400);
		return;
	}

	if (await loginUser(loginInfo)) {
		const accessToken = jwt.sign(
			{ username: loginInfo.username, role: "user" },
			getAccessTokenSecret()
		);
		resp.json({
			accessToken,
		});
	} else resp.status(401).send("Username or password incorrect");
}
