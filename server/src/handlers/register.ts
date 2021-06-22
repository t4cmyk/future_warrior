import { Request, Response } from "express";
import { createUserToken } from "../authentication";
import { createParticipates } from "../database/game";
import { loginUser } from "../database/login";
import {
	createUser,
	isFreeMail,
	isFreeUserName,
	isValidUserCreateInfo,
	UserCreateInfo,
} from "../database/register";
import { changeTeamName, createTeam, getTeams } from "../database/team";
import { sendVerificationMail } from "../mail";
import { GamePhase, getCurrentGameState } from "./status";

type CreateUserConstraint = [(userInfo: UserCreateInfo) => boolean, string];
const createUserConstraints: CreateUserConstraint[] = [
	[
		(userInfo: UserCreateInfo) => /^[A-zÀ-ÿ0-9_-]*$/.test(userInfo.name),
		"Dein Nickname darf nur aus Buchstaben und Zahlen bestehen",
	],
	[
		(userInfo: UserCreateInfo) => userInfo.name.length >= 3,
		"Dein Nickname muss aus mindestens 3 Zeichen bestehen",
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

	if (
		getCurrentGameState().phase !== GamePhase.Signup &&
		getCurrentGameState().phase !== GamePhase.Sandbox
	) {
		resp.status(400).json(["Die Registierung wurde beendet"]);
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

	if ((await isFreeMail(createInfo.mail)) === false) {
		resp.status(400).json(["Diese E-mailadresse ist bereits vergeben."]);
		return;
	}

	await createUser(createInfo);
	const loginInfo = {
		username: createInfo.name,
		password: createInfo.password,
	};
	const userId = await loginUser(loginInfo);
	if (userId <= 0) {
		resp.status(500).json(["Something went terribly wrong :("]);
		return;
	}

	if (getCurrentGameState().phase === GamePhase.Sandbox) {
		if (getTeams().length < 5) {
			while (getTeams().length < 4) {
				createTeam("FillerTeam");
			}
			createTeam("Team5");
		}
		let teamFiveId = getTeams()[4].id;
		changeTeamName(teamFiveId, "Team"+teamFiveId)
		
		createParticipates(1, teamFiveId, userId);
	}

	const jwt = createUserToken(loginInfo, userId);
	sendVerificationMail(userId, loginInfo.username, createInfo.mail);
	resp.status(200).json({ token: jwt });
}
