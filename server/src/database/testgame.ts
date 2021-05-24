import { createGame, createParticipates } from "./game";
import { getDailyMissions, Sector } from "./missions";
import { createUser } from "./register";
import { changeTeamSectors, createTeam, getSectorsFromTeamId } from "./team";

export function createTestGame() {
	createGame(new Date(), new Date());
	createTeam("greenday");
	createTeam("blink");
	createTeam("sum");
	changeTeamSectors(1, Sector.diet, Sector.energy, Sector.household);
	changeTeamSectors(1, Sector.diet, Sector.energy, Sector.mobility);
	createParticipates(1, 1, 1);
}

export function testSections() {
	changeTeamSectors(1, Sector.energy, Sector.energy, Sector.energy);
	console.log(getSectorsFromTeamId(1));
	changeTeamSectors(1, Sector.diet, Sector.energy, Sector.mobility);
	console.log(getSectorsFromTeamId(1));
}

export function getTestMissionPool() {
	console.log(getDailyMissions(1));
}
