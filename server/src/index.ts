import express from "express";
import cors from "cors";
import config from "config";
import jwt from "jsonwebtoken";
import { json as jsonBodyParser } from "body-parser";
import { registerUserHandler } from "./handlers/register";
import { loginUserHandler } from "./handlers/login";
import { initMissions } from "./database/missions";
import { createTestGame } from "./database/testgame";

async function setupServer() {
	const app = express(); // app = webserver

	const corsAllowed = config.get<string>("cors");
	app.use(cors({ allowedHeaders: corsAllowed }));
	app.use(jsonBodyParser());

	const users = [
		{
			username: "john",
			password: "password123admin",
			role: "admin",
		},
		{
			username: "anna",
			password: "password123member",
			role: "member",
		},
	];
	const accessTokenSecret = "youraccesstokensecret";

	app.get("/secret", (req, res) => {
		const result = jwt.verify(req.body, accessTokenSecret);
		console.log(result);
		res.sendStatus(200);
	});

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
