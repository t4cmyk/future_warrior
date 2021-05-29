import { convertJsToSQLDate, getEndOfDay, getStartOfDay } from "../util";
import { database } from "./core";
import { isKeyMissionFromTeamFinished } from "./keyMission";

const selectAllTeamScores = database.prepare<[]>(
	`SELECT id as team, IFNULL(score, 1) as score FROM teams LEFT OUTER JOIN 
	(SELECT team, SUM(score) AS score FROM completedMissions, missions WHERE completedMissions.mission = missions.id GROUP BY team) AS scores ON teams.id=scores.team`
);

const selectTotalScoreForTeam = database.prepare<[number]>(
	"SELECT SUM(score) AS score FROM completedMissions, missions WHERE team=? AND completedMissions.mission = missions.id"
);

const selectScoreForTeamAndDate = database.prepare<[number, string, string]>(
	"SELECT SUM(score) AS score FROM completedMissions, missions WHERE team=? AND completedMissions.mission = missions.id AND time>=? AND time<=?"
);

export function getAllTeamScores() {
	return selectAllTeamScores.all() as { team: number; score: number }[];
}

export function getTotalScoreForTeam(team: number) {
	return (selectTotalScoreForTeam.get(team).score || 0) as number;
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
	).score || 0) as number;
}

const pointsForLevel2 = 55;
const pointsForLevel3 = 120;
const pointsForLevel4 = 195;
const pointsForCompletePlanet = 280;
const pointsForOneHappinessPoint = 20;

export function getTeamLevel(team: number) {
	let score = getTotalScoreForTeam(team);
	if (score >= pointsForLevel4) return 4;
	if (score >= pointsForLevel3) return 3;
	if (score >= pointsForLevel2) return 2;
	return 1;
}
export function getHappinessPoints(team: number) {
	if (!isKeyMissionFromTeamFinished(team)) return 0;
	let score = getTotalScoreForTeam(team);
	if (score <= pointsForCompletePlanet) return 0;
	return (score - pointsForCompletePlanet) / pointsForOneHappinessPoint;
}
