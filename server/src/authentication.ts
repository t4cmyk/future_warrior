import jwt from "jsonwebtoken";
import { LoginInfo } from "./database/login";
import { getAccessTokenSecret } from "./util";

export function createUserToken(loginInfo: LoginInfo) {
	return jwt.sign(
		{ username: loginInfo.username, role: "user" },
		getAccessTokenSecret()
	);
}
