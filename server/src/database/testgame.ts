import { createGame, createParticipates } from "./game";
import { pickDailyMissions, Sector } from "./missions";
import { changeTeamSectors, createTeam } from "./team";

export function createTestGame() {
	createGame(new Date(), new Date());
	createTeam("greenday");
	createTeam("blink");
	createTeam("sum");
	changeTeamSectors(1, Sector.diet, Sector.energy);
	createParticipates(1, 1, 1);
	pickDailyMissions(1);
}
