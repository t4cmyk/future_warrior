import { getAccessTokenSecret } from "../util";
import { database } from "./core";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";

const mailVadilityTime = 15 * 60 * 1000;

const selectPlayersWithMailQuery = database.prepare<string>(
	"SELECT * FROM players WHERE mail=lower(?)"
);

export function getPlayerWithMail(mail: string) {
	return selectPlayersWithMailQuery.get(mail);
}

const changePasswordQuery = database.prepare<[string, string, number]>(
	"UPDATE players SET password=?, passwordSalt=? WHERE id=?"
);

export function changePassword(user: number, newPassword: string) {
	const salt = createHash("sha256").update(new Date().toString()).digest("hex");
	const hash = createHash("sha256")
		.update(salt)
		.update(newPassword)
		.digest("hex");
}

export interface IPwRecoveryData {
	id: number;
	timestamp: number;
}

export function createPwRecoveryToken(userId: number) {
	return jwt.sign(
		{ id: userId, time: new Date().valueOf},
		getAccessTokenSecret()
	);
}

function isPwRecoveryData(data: Object): data is IPwRecoveryData {
	if (!("id" in data)) return false;
	if (typeof data["id"] !== "number") return false;

	if (!("timestamp" in data)) return false;
	if (typeof data["timestamp"] !== "number") return false;

	return true;
}

export function verifyPwRecoveryToken(token: string) {
	try {
		const result = jwt.verify(token, getAccessTokenSecret());
		if (!isPwRecoveryData(result))
			throw new Error("Invalid password recovery token");
		let dist = new Date().valueOf() - result.timestamp;
		if (dist < 0) throw new Error("Invalid password recovery token");
		if (dist > mailVadilityTime)
			throw new Error(
				"Der Link ist abgelaufen. Bitte beantrage einen neuen Passwortwiederherstellungslink."
			);
		return result;
	} catch {
		return undefined;
	}
}
