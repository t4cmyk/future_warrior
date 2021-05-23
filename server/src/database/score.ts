import { convertJsToSQLDate, getEndOfDay, getStartOfDay } from "../util";
import { database } from "./core";

const selectAllTeamScores = database.prepare<[]>(
	"SELECT team, SUM(score) AS score FROM completedMissions, missions WHERE completedMissions.mission = missions.id GROUP BY team"
);

const selectTotalScoreForTeam = database.prepare<[number]>(
	"SELECT SUM(score) AS score FROM completedMissions, missions WHERE team=? AND completedMissions.mission = missions.id"
);

const selectScoreForTeamAndDate = database.prepare<[number, string, string]>(
	"SELECT SUM(score) AS score FROM completedMissions, missions WHERE team=? AND completedMissions.mission = missions.id AND time>=? AND time<=?"
);

export function getAllTeamScores() {
	return selectAllTeamScores.all() as [number, number][];
}

export function getTotalScoreForTeam(team: number) {
	return (selectTotalScoreForTeam.get(team).total || 0) as number;
}

export function getTeamScoreForDate(
	team: number,
	startDate: Date,
	endDate: Date
) {
	const begin = getStartOfDay(startDate);
	const end = getEndOfDay(endDate);
	return (selectScoreForTeamAndDate.get(
		team,
		convertJsToSQLDate(begin),
		convertJsToSQLDate(end)
	).total || 0) as number;
}
