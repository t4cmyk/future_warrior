import express from "express";
import cors from "cors";
import config from "config";

async function setupServer() {


	const app = express(); // app = webserver
	const corsAllowed = config.get<string>("cors");
	app.use(cors({ allowedHeaders: corsAllowed }));

	//app.use("", express.static("../client/dist"));

	let port = config.get<number>("port");
	app.listen(port);
	console.log(`Listen on port ${port}... `);
	console.log("Hello")
	console.log("------------------------------");
}

setupServer();
