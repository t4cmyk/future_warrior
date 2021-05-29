import { database } from "./core";

const selectKeyMissionStatusQuery = database.prepare<number>(
	"SELECT finishedKeyMission FROM teams WHERE id=?"
);

const changeKeyMissionsStatusQuery = database.prepare<[number, number]>(
	"UPDATE teams SET finishedKeyMission = ? WHERE id=?"
);

export function isKeyMissionFromTeamFinished(team: number) {
	return selectKeyMissionStatusQuery.get(team).finishedKeyMission;
}

export function changeKeyMissionsStatus(finished: boolean, team: number) {
	changeKeyMissionsStatusQuery.run(finished? 1: 0, team);
}
