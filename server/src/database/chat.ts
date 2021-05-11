import { database } from "./core";
import { getTeamIDFromUserId } from "./team";

const insertChatMsg = database.prepare<[number, number, string]>(
	"INSERT INTO chat (player, team, time, message) VALUES (?, ?, datetime('now'), ?)"
);

const selectChatForTeam = database.prepare<[number]>(
	"SELECT time, name, message FROM chat, players WHERE team=? AND players.id=chat.player ORDER BY time DESC LIMIT 20"
);

export function addChatMsg(playerId: number, message: string) {
	const teamId = getTeamIDFromUserId(playerId);
	if (!teamId) return undefined;
	insertChatMsg.run(playerId, teamId, message);
	return getChatForTeam(teamId);
}

export function getChatForTeam(teamId: number) {
	return selectChatForTeam.all(teamId) as {
		time: string;
		name: string;
		message: string;
	}[];
}
