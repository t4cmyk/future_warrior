import { Request, Response } from "express";
import { getTeamScoreForDate } from "../database/score";
import { getLatestFeedback } from "../database/stats";
import { getTeams } from "../database/team";
import { daysBetween, getEndOfDay, getStartOfDay } from "../util";

function getTeamStats() {
	const teams = getTeams();
	const teamScores: { team: number; scores: number[] }[] = [];
	const initalDate = new Date(2021, 5, 23);

	for (let team of teams) {
		const scores: number[] = [];
		for (let date of daysBetween(new Date(), initalDate)) {
			const start = getStartOfDay(date);
			const end = getEndOfDay(date);
			const teamScore = getTeamScoreForDate(team.id, start, end);
			scores.push(teamScore);
		}

		teamScores.push({ team: team.id, scores: scores });
	}

	const result = [];
	const idx = 0;
	for (let date of daysBetween(new Date(), initalDate)) {
		const dailyData: any = {};
		dailyData.date = `${date.getDate()}.${date.getMonth() + 1}.`;
		teamScores.forEach((score) => {
			dailyData[score.team] = score.scores[idx];
		});
		result.push(dailyData);
	}

	return result;
}

export function handleFeedbackData(req: Request, resp: Response) {
	const feedback = getLatestFeedback();
	resp.status(200).json({ feedback: feedback });
}

export function handleStatsData(req: Request, resp: Response) {
	const teamStats = getTeamStats();
	resp.status(200).json(teamStats);
}
