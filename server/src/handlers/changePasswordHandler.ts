import { Request, Response } from "express";
import {
	changePassword,
	verifyPwRecoveryToken,
} from "../database/passwordRecovery";

interface ChangePwInfo {
	password: string;
	token: string;
}

function isChangePwInfo(info: any): info is ChangePwInfo {
	if (typeof info !== "object" || info === null) return false;

	const fields = ["password", "token"];

	const result = fields.reduce((prev, field) => {
		if (!(field in info)) return false;
		if (typeof info[field] !== "string") return false;
		return prev;
	}, true);
	return result;
}

type CreatePwChangeConstraint = [
	(changePwInfo: ChangePwInfo) => boolean,
	string
];
const createPwChangeConstraints: CreatePwChangeConstraint[] = [
	[
		(changePwInfo: ChangePwInfo) =>
			verifyPwRecoveryToken(changePwInfo.token) != undefined,
		"Der Passwortwiederherstellungslink ist abgelaufen oder fehlerhaft.",
	],
	[
		(changePwInfo: ChangePwInfo) => changePwInfo.token.length > 0,
		"Bitte fordere eine neue Passwortwiederherstellungsmail an und folge dem Link in der Mail.",
	],
	[
		(changePwInfo: ChangePwInfo) => changePwInfo.password.length > 0,
		"Bitte gib ein Passwort ein",
	],
];

export async function changePasswordHandler(req: Request, resp: Response) {
	try {
		const pwChangeInfo = req.body;

		if (!isChangePwInfo(pwChangeInfo)) {
			resp.status(400).json(["Bad Request"]);
			return;
		}

		const violatedConstaints = createPwChangeConstraints.filter(
			(val) => !val[0](pwChangeInfo)
		);
		if (violatedConstaints.length > 0) {
			resp.status(400).json(violatedConstaints.map((val) => val[1]));
			return;
		}

		const token = req.body.token;
		const newPw = req.body.password;
		let tokenContent = verifyPwRecoveryToken(token);
		if (tokenContent != undefined) changePassword(tokenContent.id, newPw);
		else throw new Error();

		resp.status(200).json({});
	} catch {
		resp.sendStatus(500);
	}
}
