import { database } from "./core";

const selectLatestFeedback = database.prepare<[]>(
	"SELECT name, description, feedback, enjoy, importance, frequency, comments FROM feedback, missions WHERE missions.id=feedback.missionId ORDER BY time DESC LIMIT 20"
);

export function getLatestFeedback() {
	return selectLatestFeedback.all() as {
		name: string;
		description: string;
		feedback: string;
		enjoy: number;
		importance: number;
		frequency: number;
		comments: string;
	}[];
}
