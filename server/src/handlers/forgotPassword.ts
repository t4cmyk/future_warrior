import { Request, Response } from "express";
import { getPlayerWithMail } from "../database/passwordRecovery";
import { contactMail, sendPwRecoveryMail } from "../mail";

export interface pwRecoveryInfo {
	mail: string;
}

export function isPwRecoveryInfo(info: any): info is pwRecoveryInfo {
	if (typeof info !== "object" || info === null) return false;

	const fields = ["mail"];

	const result = fields.reduce((prev, field) => {
		if (!(field in info)) return false;
		if (typeof info[field] !== "string") return false;
		return prev;
	}, true);
	return result;
}

type CreatePwRecoveryConstraint = [(pwInfo: pwRecoveryInfo) => boolean, string];
const createPwRecoveryConstraints: CreatePwRecoveryConstraint[] = [
	[
		(pwInfo: pwRecoveryInfo) =>
			/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
				pwInfo.mail
			),
		"Du musst eine gültige E-Mailadresse angeben",
	],
	[
		(pwInfo: pwRecoveryInfo) => getPlayerWithMail(pwInfo.mail) != null,
		"Wir konnten keinen Benutzer mit dieser E-mailadresse finden.",
	],
];

export async function forgotPasswordHandler(req: Request, resp: Response) {
	try {
		const pwRecoveryInfo = req.body;

		if (!isPwRecoveryInfo(pwRecoveryInfo)) {
			resp.status(400).json(["Bad Request"]);
			return;
		}

		const violatedConstaints = createPwRecoveryConstraints.filter(
			(val) => !val[0](pwRecoveryInfo)
		);
		if (violatedConstaints.length > 0) {
			resp.status(400).json(violatedConstaints.map((val) => val[1]));
			return;
		}
		let user = getPlayerWithMail(pwRecoveryInfo.mail).name;
		sendPwRecoveryMail(user, pwRecoveryInfo.mail);

		resp.status(200).json({});
	} catch {
		resp.sendStatus(500);
	}
}
