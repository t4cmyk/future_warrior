import { database } from "./core";
import { Sector } from "./missions";

const selectTeams = database.prepare("SELECT id, name FROM teams");

const createTeamQuery = database.prepare<string>(
	"INSERT INTO teams (name, sector1, sector2) VALUES (?, null, null)"
);

const getTeamIdFromUserIdQuery = database.prepare<number>(
	"SELECT teamId FROM participates WHERE playerId=?"
);

const getSectorsFromTeamIdQuery = database.prepare<number>(
	"SELECT sector1, sector2, sector3 FROM teams WHERE id=? "
);

const changeTeamSectorsQuery = database.prepare<
	[Sector, Sector, Sector, number]
>("UPDATE teams SET sector1 = ?, sector2 = ?, sector3 = ? WHERE id=?");

export function getTeams() {
	const teams: { name: string; id: number }[] = selectTeams
		.all()
		.map((entry) => {
			return { name: entry.name, id: entry.id };
		});
	return teams;
}

export function getSectorsFromTeamId(teamId: number) {
	return getSectorsFromTeamIdQuery.get(teamId);
}

export function getTeamIDFromUserId(userId: number) {
	const result: { teamId: number } = getTeamIdFromUserIdQuery.get(userId);
	return result.teamId;
}

export function createTeam(name: string) {
	createTeamQuery.run(name);
}

export function changeTeamSectors(
	teamId: number,
	sec1: Sector,
	sec2: Sector,
	sec3: Sector
) {
	changeTeamSectorsQuery.run(sec1, sec2, sec3, teamId);
}
