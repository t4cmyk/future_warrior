import { database } from "./core";

interface IMissionFeedback {
	enjoy: number;
	importance: number;
	feedback: string;
	frequency: number;
	comment: string;
}

export function isValidMissionFeedback(data: any): data is IMissionFeedback {
	// todo
	return true;
}

const getMissionId = database.prepare<[number, number]>(
	"SELECT mission FROM dailyMissions WHERE id=? AND team=?"
);

export function getMissionIdFromDailyId(
	dailyMissionId: number,
	teamId: number
) {
	const result: { mission: number } = getMissionId.get(dailyMissionId, teamId);
	if (!result) return -1;
	return result.mission;
}

const selectIncompleteMission = database.prepare<[number]>(
	"SELECT COUNT(*) AS count FROM dailyMissions WHERE id=?"
);

const createScoreEntry = database.prepare<[number, number]>(
	"INSERT INTO score (team, mission, time) VALUES (?, ?, datetime('now'))"
);

const updateDailyMissionComplete = database.prepare<[number, number]>(
	"UPDATE dailyMissions SET completedByPlayer=? WHERE id=? AND completedByPlayer IS NULL"
);

const createFeedbackEntry = database.prepare<
	[number, number, string, number, number, number, string]
>(
	"INSERT INTO feedback (missionId, playerId, time, feedback, enjoy, importance, frequency, comments) VALUES (?,?,datetime('now'),?,?,?,?,?)"
);

export function completeMission(
	playerId: number,
	dailyMissionId: number,
	missionId: number,
	teamId: number,
	feedback: IMissionFeedback
) {
	if (selectIncompleteMission.get(dailyMissionId) > 0)
		createScoreEntry.run(teamId, missionId);
	updateDailyMissionComplete.run(playerId, dailyMissionId);
	createFeedbackEntry.run(
		missionId,
		playerId,
		feedback.feedback,
		feedback.enjoy,
		feedback.importance,
		feedback.frequency,
		feedback.comment
	);
}
