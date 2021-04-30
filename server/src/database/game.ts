import { convertJsToSQLDate } from "../util";
import { database } from "./core";

const createGameQuery = database.prepare<[string,string]>(
	"INSERT INTO games (start, ending) VALUES (?, ?)"
);

const createParticipatesQuery = database.prepare<
	[number, number, number, number]
>(
	"INSERT INTO participates (gameId, teamId, playerId, score) VALUES (?,?,?,?)"
);

export function createGame(start: Date, ending: Date) {
    //createGameQuery.run(start, ending);
	createGameQuery.run(convertJsToSQLDate(start), convertJsToSQLDate(ending));
}

export function createParticipates(
	gameId: number,
	teamId: number,
	playerId: number
) {
	createParticipatesQuery.run(gameId, teamId, playerId, 0);
}
