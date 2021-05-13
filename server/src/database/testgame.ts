import { createGame, createParticipates } from "./game";
import { Sector } from "./missions";
import { createUser } from "./register";
import { changeTeamSectors, createTeam } from "./team";

export function createTestGame() {
	createGame(new Date(), new Date());
	createTeam("greenday");
	createTeam("blink");
	createTeam("sum");
	createUser(	{name: "test",
		password: "test",
		mail: "t@t.t",
		plz: "00000"})
	changeTeamSectors(1, Sector.diet, Sector.energy);
	createParticipates(1, 1, 1);
}
