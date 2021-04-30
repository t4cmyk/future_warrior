import { database } from "./core";
import { Sector } from "./missions";

const createTeamQuery = database.prepare<string>(
	"INSERT INTO teams (name, sector1, sector2) VALUES (?, null, null)"
);

const getTeamIdFromUserIdQuery = database.prepare<number>(
	"SELECT teamID FROM participates WHERE playerId=?"
);

const getSectorsFromTeamIdQuery = database.prepare<number>(
	"SELECT sector1, sector2 FROM teams WHERE id=? "
);

const changeTeamSectorsQuery = database.prepare<[Sector, Sector, number]>(
	"UPDATE teams SET sector1 = ?, sector2 = ? WHERE id=?"
);

export function getSectorsFromTeamId(teamId: number) {
	return getSectorsFromTeamIdQuery.all(teamId);
}

export function getTeamIDFromUserId(userId: number) {
	return getTeamIdFromUserIdQuery.get(userId);
}

export function createTeam(name: string) {
	createTeamQuery.run(name);
}

export function changeTeamSectors(teamId: number, sec1: Sector, sec2: Sector) {
	changeTeamSectorsQuery.run(sec1, sec2, teamId);
}
