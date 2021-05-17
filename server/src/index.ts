import express, { Request, Response } from "express";
import cors from "cors";
import config from "config";
import * as path from "path";
import jwt from "jsonwebtoken";
import { text as textBodyParser, json as jsonBodyParser } from "body-parser";
import { registerUserHandler } from "./handlers/register";
import { loginUserHandler } from "./handlers/login";
import { initMissions, Mission } from "./database/missions";
import { createTestGame } from "./database/testgame";
import { missionsHandler, queryMissionHandler } from "./handlers/missions";
import { authenticateUser } from "./authentication";
import { completeMissionHandler } from "./handlers/completeMission";
import { handleTeamsData } from "./handlers/teams";
import { getChatHandler, postChatMsgHandler } from "./handlers/chat";
import { planetHandler } from "./handlers/planet";
import { contactFormHandler } from "./handlers/contactForm";
import { getStatusHandler } from "./handlers/status";
import { forgotPasswordHandler } from "./handlers/forgotPassword";

async function setupServer() {
	const app = express(); // app = webserver

	const corsAllowed = config.get<string>("cors");
	app.use(cors({ allowedHeaders: corsAllowed }));
	app.use(jsonBodyParser());

	app.get("/status", getStatusHandler);
	app.get("/missions", authenticateUser, missionsHandler);
	app.get("/mission/:missionId", queryMissionHandler);
	app.get("/planet", authenticateUser, planetHandler);
	app.get("/teams", handleTeamsData);
	app.post("/complete", authenticateUser, completeMissionHandler);
	app.get("/chat", authenticateUser, getChatHandler);
	app.post("/chat", textBodyParser(), authenticateUser, postChatMsgHandler);
	app.post("/register", registerUserHandler);
	app.post("/contactForm", contactFormHandler);
	app.post("/login", loginUserHandler);
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
	createTestGame();
}

setupServer();
function changePasswordHandler(arg0: string, changePasswordHandler: any) {
	throw new Error("Function not implemented.");
}

