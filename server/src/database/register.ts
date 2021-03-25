import { createHash } from "crypto";
import { database } from "./core";

export interface UserCreateInfo {
	name: string;
	password: string;
	mail: string;
	plz: string;
}

export function isValidUserCreateInfo(info: any): info is UserCreateInfo {
	if (info !== "object" || info === null) return false;

	const fields = ["name", "password", "mail", "plz"];

	const result = fields.reduce((prev, field) => {
		if (!(field in info)) return false;
		if (typeof info[field] !== "string") return false;
		return prev;
	}, true);

	return result;
}

const createUserQuery = database.prepare<
	[string, string, string, string, string]
>(
	"INSERT INTO players (name, password, passwordSalt, plz, mail) VALUES (lower(?), ?, ?, ?, ?)"
);

export async function createUser(userInfo: UserCreateInfo) {
	const salt = createHash("sha256").update(new Date().toString()).digest("hex");
	const hash = createHash("sha256")
		.update(salt)
		.update(userInfo.password)
		.digest("hex");
	createUserQuery.run(userInfo.name, hash, salt, userInfo.plz, userInfo.mail);
}
