import { Request, Response } from "express";
import { contactMail } from "../mail";

export interface contactFormInfo {
	name: string;
	mail: string;
	subject: string;
	message: string;
}

export function isContactFormInfo(info: any): info is contactFormInfo {
	if (typeof info !== "object" || info === null) return false;

	const fields = ["name", "mail", "subject", "message"];

	const result = fields.reduce((prev, field) => {
		if (!(field in info)) return false;
		if (typeof info[field] !== "string") return false;
		return prev;
	}, true);
	return result;
}

type CreateContactConstraint = [
	(contactInfo: contactFormInfo) => boolean,
	string
];
const createContactConstraints: CreateContactConstraint[] = [
	[
		(contactInfo: contactFormInfo) => /^[A-zÀ-ÿ0-9_-]*$/.test(contactInfo.name),
		"Dein Nickname darf nur aus Buchstaben und Zahlen bestehen",
	],
	[
		(contactInfo: contactFormInfo) => contactInfo.name.length >= 3,
		"Dein Nickname muss aus mindestens 3 Zeichen bestehen",
	],
	[
		(contactInfo: contactFormInfo) =>
			/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
				contactInfo.mail
			),
		"Du musst eine gültige E-Mail angeben",
	],
	[
		(contactInfo: contactFormInfo) => contactInfo.subject.length > 0,
		"Bitte gib einen Betreff ein",
	],
	[
		(contactInfo: contactFormInfo) => contactInfo.message.length > 0,
		"Bitte gib eine Nachricht ein",
	],
];

export async function contactFormHandler(req: Request, resp: Response) {
	try {
		const contactInfo = req.body;

		if (!isContactFormInfo(contactInfo)) {
			resp.status(400).json(["Bad Request"]);
			return;
		}

		const violatedConstaints = createContactConstraints.filter(
			(val) => !val[0](contactInfo)
		);
		if (violatedConstaints.length > 0) {
			resp.status(400).json(violatedConstaints.map((val) => val[1]));
			return;
		}

		contactMail(
			contactInfo.name,
			contactInfo.mail,
			contactInfo.subject,
			contactInfo.message
		);

		resp.status(200).json({});
	} catch {
		resp.sendStatus(500);
	}
}
