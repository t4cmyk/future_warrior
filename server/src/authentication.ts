import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LoginInfo } from "./database/login";
import { getAccessTokenSecret } from "./util";

export interface IUserData {
	id: number;
	username: string;
	role: "user" | "admin";
}

function isUserData(data: Object): data is IUserData {
	if (!("id" in data)) return false;
	if (typeof data["id"] !== "number") return false;

	if (!("username" in data)) return false;
	if (typeof data["username"] !== "string") return false;

	if (!("role" in data)) return false;
	if (data["role"] !== "user" && data["role"] !== "admin") return false;

	return true;
}

export function createUserToken(loginInfo: LoginInfo, userId: number) {
	return jwt.sign(
		{ id: userId, username: loginInfo.username, role: "user" },
		getAccessTokenSecret()
	);
}

export function authenticateUser(
	req: Request,
	resp: Response,
	next: NextFunction
) {
	let user: IUserData | undefined;
	if (req.query.token) {
		user = verifyUserToken(req.query.token as string);
	}
	if (!user) {
		resp.sendStatus(401);
		return;
	}

	req.currentUser = user;
	next();
}

function verifyUserToken(token: string) {
	try {
		const result = jwt.verify(token, getAccessTokenSecret());
		if (!isUserData(result)) throw new Error("Invalid user token");
		return result;
	} catch {
		return undefined;
	}
}
