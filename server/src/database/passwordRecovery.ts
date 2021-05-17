import { database } from "./core";

const selectPlayersWithMailQuery = database.prepare<string>(
	"SELECT * FROM players WHERE mail=lower(?)"
);

export function getPlayerWithMail(mail: string){
    return selectPlayersWithMailQuery.get(mail);
}
