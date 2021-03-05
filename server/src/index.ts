import express from "express";
import cors from "cors";
import config from "config";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

async function setupServer() {
	const app = express(); // app = webserver

	const corsAllowed = config.get<string>("cors");
	app.use(cors({ allowedHeaders: corsAllowed }));
	app.use(bodyParser.json());

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

	app.post("/login", (req, res) => {
		// Read username and password from request body
		const { username, password } = req.body;

		// Filter user from the users array by username and password
		const user = users.find((u) => {
			return u.username === username && u.password === password;
		});

		if (user) {
			// Generate an access token
			const accessToken = jwt.sign(
				{ username: user.username, role: user.role },
				accessTokenSecret
			);

			res.json({
				accessToken,
			});
		} else {
			res.status(401).send("Username or password incorrect");
		}
	});

	app.use("", express.static("../client/dist"));

	let port = config.get<number>("port");
	app.listen(port);
	console.log(`Listen on port ${port}... `);
	console.log("Hello");
	console.log("------------------------------");
}

setupServer();
