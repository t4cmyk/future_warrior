import { createHash } from "crypto";
import { database } from "./core";

export interface LoginInfo {
	username: string;
	password: string;
}

export function isValidLoginInfo(info: any): info is LoginInfo {
	if (info !== "object" || info === null) return false;

	const fields = ["username", "password"];

	const result = fields.reduce((prev, field) => {
		if (!(field in info)) return false;
		if (typeof info[field] !== "string") return false;
		return prev;
	}, true);

	return result;
}

const getUserIdAndSalt = database.prepare<string>(
	"SELECT id, passwordSalt FROM players WHERE name=lower(?)"
);
const loginUserQuery = database.prepare<[number, string]>(
	"SELECT COUNT(*) FROM players WHERE id=? AND password=?"
);

export async function loginUser(loginInfo: LoginInfo) {
	const userIdResult = getUserIdAndSalt.get(loginInfo.username);
	if (!userIdResult) return false;
	const [userId, salt]: [number, string] = userIdResult;
	const passwordHash = createHash("sha256")
		.update(salt)
		.update(loginInfo.password)
		.digest("hex");
	const loginResult = loginUserQuery.get(userId, passwordHash);
	return loginResult > 0;
}
