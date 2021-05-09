import express from "express";
import cors from "cors";
import config from "config";
import jwt from "jsonwebtoken";
import { json as jsonBodyParser } from "body-parser";
import { registerUserHandler } from "./handlers/register";
import { loginUserHandler } from "./handlers/login";
import { initMissions, Mission } from "./database/missions";
import { createTestGame } from "./database/testgame";
import { missionsHandler } from "./handlers/missions";
import { authenticateUser } from "./authentication";
import { completeMissionHandler } from "./handlers/completeMission";

async function setupServer() {
	const app = express(); // app = webserver

	const corsAllowed = config.get<string>("cors");
	app.use(cors({ allowedHeaders: corsAllowed }));
	app.use(jsonBodyParser());

	app.get("/missions", authenticateUser, missionsHandler);
	app.post("/complete", authenticateUser, completeMissionHandler);
	app.post("/register", registerUserHandler);
	app.post("/login", loginUserHandler);

	app.use("", express.static("../client/dist"));

	let port = config.get<number>("port");
	app.listen(port);
	console.log(`Listen on port ${port}... `);
	console.log("Hello");
	console.log("------------------------------");
	initMissions();
	createTestGame();
}

setupServer();
