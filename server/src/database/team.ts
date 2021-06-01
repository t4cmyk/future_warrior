import { database } from "./core";

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

const selectPlayerSectorQuery = database.prepare<[number, number]>(
	"SELECT sector FROM participates WHERE playerId=? AND teamId=? "
);

const selectTeamNameQuery = database.prepare<[number]>(
	"SELECT name FROM teams WHERE id=? "
);

const selectPlayerSectorsByTeamQuery = database.prepare<[number]>(
	"SELECT sector FROM participates WHERE teamId=? "
);

const updatePlayerSectorQuery = database.prepare<[string, number, number]>(
	"UPDATE participates SET sector = ? WHERE playerId=? AND teamId=?"
);

const changeTeamSectorsQuery = database.prepare<
	[string, string, string, number]
>("UPDATE teams SET sector1 = ?, sector2 = ?, sector3 = ? WHERE id=?");

const getMemberNamesByTeamQuery = database.prepare<number>(
	"SELECT name FROM participates, players WHERE teamId=? AND players.id=participates.playerId"
);

export function getTeams() {
	const teams: { name: string; id: number }[] = selectTeams
		.all()
		.map((entry) => {
			return { name: entry.name, id: entry.id };
		});
	return teams;
}

const resetPlayerSectorsOfTeamQuery = database.prepare<[number]>(
	"UPDATE participates SET sector = null WHERE teamId=?"
);

export function getSectorsFromTeamId(teamId: number) {
	return getSectorsFromTeamIdQuery.get(teamId) as {
		sector1: string;
		sector2: string;
		sector3: string;
	};
}

export function getTeamIDFromUserId(userId: number) {
	const result: { teamId: number } = getTeamIdFromUserIdQuery.get(userId);
	return result.teamId;
}

export function getTeamName(team: number) {
	return selectTeamNameQuery.get(team).name;
}

export function createTeam(name: string) {
	createTeamQuery.run(name);
}

export function changeTeamSectors(
	teamId: number,
	sec1: any,
	sec2: any,
	sec3: any
) {
	changeTeamSectorsQuery.run(sec1, sec2, sec3, teamId);
}

export function changePlayerSector(user: number, team: number, sec: any) {
	updatePlayerSectorQuery.run(sec, user, team);
}

export function getPlayerSector(user: number, team: number) {
	return selectPlayerSectorQuery.get(user, team);
}

export function checkTeamSectorChoice(team: number) {
	let sectors = selectPlayerSectorsByTeamQuery.all(team);
	let result = sectors[0].sector;
	sectors.forEach((s) => {
		if (s.sector != sectors[0].sector) result = null;
	});
	return result;
}

export function resetPlayerSectorsOfTeam(team: number) {
	resetPlayerSectorsOfTeamQuery.run(team);
}

export function getTeamMemberNamesByTeamId(teamId: number) {
	return getMemberNamesByTeamQuery.all(teamId);
}
