import { database } from "./core";

const createTeamQuery = database.prepare<string>(
	"INSERT INTO missions (name, sector1, sector2) VALUES (?)"
);

const getTeamIdFromUserIdQuery = database.prepare<number>(
	"SELECT teamID FROM participates WHERE userId=?"
);

const getSectorsFromTeamId = database.prepare<number>(
	"SELECT sector1, sector2 FROM teams WHERE id=? "
);

export function getTeamIDFromUserID(userId: number) {
	return getTeamIdFromUserIdQuery.get(userId);
}
