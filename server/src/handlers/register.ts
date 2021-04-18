import { Request, Response } from "express";
import { createUserToken } from "../authentication";
import { loginUser } from "../database/login";
import {
	createUser,
	isFreeUserName,
	isValidUserCreateInfo,
	UserCreateInfo,
} from "../database/register";

type CreateUserConstraint = [(userInfo: UserCreateInfo) => boolean, string];
const createUserConstraints: CreateUserConstraint[] = [
	[
		(userInfo: UserCreateInfo) => /^[A-zÀ-ÿ0-9_-]*$/.test(userInfo.name),
		"Dein Nickname darf nur aus Buchstaben und Zahlen bestehen",
	],
	[
		(userInfo: UserCreateInfo) => userInfo.name.length >= 3,
		"Dein Nichname muss aus mindestens 3 Zeichen bestehen",
	],
	[
		(userInfo: UserCreateInfo) =>
			/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
				userInfo.mail
			),
		"Du musst eine gültige E-Mail angeben",
	],
	[
		(userInfo: UserCreateInfo) => userInfo.password.length > 0,
		"Bitte gib ein Passwort ein",
	],
	[
		(userInfo: UserCreateInfo) => /^[0-9]{5,5}$/.test(userInfo.plz),
		"Deine PLZ muss aus 5 Zahlen bestehen",
	],
];

export async function registerUserHandler(req: Request, resp: Response) {
	const createInfo = req.body;

	if (!isValidUserCreateInfo(createInfo)) {
		resp.status(400).json(["Bad Request"]);
		return;
	}

	const violatedConstaints = createUserConstraints.filter(
		(val) => !val[0](createInfo)
	);
	if (violatedConstaints.length > 0) {
		resp.status(400).json(violatedConstaints.map((val) => val[1]));
		return;
	}

	if ((await isFreeUserName(createInfo.name)) === false) {
		resp.status(400).json(["Dieser Nickname ist bereits vergeben"]);
		return;
	}

	await createUser(createInfo);
	const loginInfo = {
		username: createInfo.name,
		password: createInfo.password,
	};
	if (!(await loginUser(loginInfo))) {
		resp.status(500).json(["Something went terribly wrong :("]);
		return;
	}
	const jwt = createUserToken(loginInfo);
	resp.status(200).json({ token: jwt });
}
