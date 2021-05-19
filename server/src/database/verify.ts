import { getAccessTokenSecret } from "../util";
import jwt from "jsonwebtoken";
import { database } from "./core";

interface IMailVerificationData{
    id: number;
    isMailToken: boolean;
}

const verifyUserQuery = database.prepare<number>(
	"UPDATE players SET verified=true WHERE id=?"
);

export function verifyUser(user : number){
    verifyUserQuery.run(user);
}

export function createMailVerificationToken(userId: number) {
	return jwt.sign(
		{ id: userId, isMailToken: true},
		getAccessTokenSecret()
	);
}

function isMailVerificationData(data: Object): data is IMailVerificationData {
	if (!("id" in data)) return false;
	if (typeof data["id"] !== "number") return false;

	if (!("isMailToken" in data)) return false;
	if (typeof data["isMailToken"] !== "boolean") return false;

	return true;
}

export function verifyMailVerificationToken(token: string) {
	try {
		const result = jwt.verify(token, getAccessTokenSecret());
		if (!isMailVerificationData(result))
			throw new Error("Invalid mail verification token");
		if (!result.isMailToken) throw new Error("Invalid mail verification token");
		return result;
	} catch {
		return undefined;
	}
}