import express, { Request, Response } from "express";
import cors from "cors";
import config from "config";
import * as path from "path";
import jwt from "jsonwebtoken";
import { text as textBodyParser, json as jsonBodyParser } from "body-parser";
import { registerUserHandler } from "./handlers/register";
import { loginUserHandler } from "./handlers/login";
import { initMissions, Mission } from "./database/missions";
import { createTestGame, testSections } from "./database/testgame";
import {
	checkRemainingMissionsHandler,
	missionsHandler,
	queryMissionHandler,
} from "./handlers/missions";
import { authenticateUser } from "./authentication";
import { completeMissionHandler } from "./handlers/completeMission";
import { handleFeedbackData, handleStatsData } from "./handlers/teams";
import { getChatHandler, postChatMsgHandler } from "./handlers/chat";
import { planetDataHandler } from "./handlers/planet";
import { contactFormHandler } from "./handlers/contactForm";
import { getStatusHandler } from "./handlers/status";
import { forgotPasswordHandler } from "./handlers/forgotPassword";
import { changePasswordHandler } from "./handlers/changePasswordHandler";
import { verifyHandler } from "./handlers/verify";
import { createMailVerificationToken } from "./database/verify";
import { allTeamScoresHandler, teamScoreHandler } from "./handlers/score";
import { gameboardHandler } from "./handlers/game";
import {
	sectorChoiceHandler,
	sectorSelectionHandler,
} from "./handlers/sectorSelection";

async function setupServer() {
	const app = express(); // app = webserver

	const corsAllowed = config.get<string>("cors");
	app.use(cors({ allowedHeaders: corsAllowed }));
	app.use(jsonBodyParser());

	app.get("/status", getStatusHandler);
	app.get("/dailyMissions", authenticateUser, missionsHandler);
	app.get("/teamScore", authenticateUser, teamScoreHandler);
	app.get("/allTeamScores", authenticateUser, allTeamScoresHandler);
	app.get("/board", authenticateUser, gameboardHandler);
	app.get("/mission/:missionId", queryMissionHandler);
	app.get(
		"/checkRemainingMissions",
		authenticateUser,
		checkRemainingMissionsHandler
	);
	app.get("/planetData", authenticateUser, planetDataHandler);
	app.get("/stats", handleStatsData);
	app.get("/feedback", handleFeedbackData);
	app.post("/sectorChoice", authenticateUser, sectorChoiceHandler);
	app.get("/sectorSelection", authenticateUser, sectorSelectionHandler);
	app.post("/complete", authenticateUser, completeMissionHandler);
	app.get("/chat", authenticateUser, getChatHandler);
	app.post("/chat", textBodyParser(), authenticateUser, postChatMsgHandler);
	app.post("/register", registerUserHandler);
	app.post("/contactForm", contactFormHandler);
	app.post("/login", loginUserHandler);
	app.post("/verify", verifyHandler);
	app.post("/forgotPassword", forgotPasswordHandler);
	app.post("/changePassword", changePasswordHandler);

	app.use(express.static("../client/dist"));

	app.get("*", (req: Request, res: Response) => {
		res.sendFile(
			path.resolve(__dirname, "..", "..", "client", "dist", "index.html")
		);
	});

	let port = config.get<number>("port");
	app.listen(port);
	console.log(`Listen on port ${port}... `);
	console.log("Hello");
	console.log("------------------------------");
	initMissions();
	//testSections();
}

setupServer();
