import { database } from "./core";
import { readFileSync } from "fs";

export enum Sector {
	diet,
	energy,
	household,
	mobility,
	social,
	key,
}

export interface Mission {
	name: string;
	description: string;
	imagePath: string;
	score: number;
	sector: Sector;
	advanced: boolean;
	custom: boolean;
	creatorId: number; //default: empty
}

const createMissionQuery = database.prepare<
	[string, string, string, string, string, string, string, string]
>(
	"INSERT INTO missions (name, description, imagePath, score, sector, advanced, custom, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

export async function createTestMission() {
	createMissionQuery.run(
		"Test",
		"eat something",
		"/img/test.jpg",
		"5",
		"0",
		"0",
		"0",
		"anon"
	);
}

export async function loadMission(path: any) {
	let sector = 0;
	let imagePath;
	let advanced;
	switch (sector) {
		case Sector.diet:
			imagePath = "/img/missions/diet";
			break;
		case Sector.energy:
			imagePath = "/img/missions/energy";
			break;
		case Sector.household:
			imagePath = "/img/missions/household";
			break;
		case Sector.mobility:
			imagePath = "/img/missions/mobility";
			break;
		case Sector.social:
			imagePath = "/img/missions/social";
			break;
		case Sector.key:
			imagePath = "/img/missions/key";
			break;
	}
	if (advanced) imagePath += "-advanced";
	imagePath += ".jpg";
}

export async function createCustomMission(missionInfo: any) {
	createMissionQuery.run(
		missionInfo.name,
		missionInfo.description,
		missionInfo.imagePath,
		missionInfo.score,
		missionInfo.sector,
		missionInfo.advanced,
		missionInfo.custom,
		missionInfo.creator
	);
}

const getNormalMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE advanced=false AND custom=false"
);

const getAdvancedMissionsQuery = database.prepare<Sector>(
	"SELECT * FROM missions WHERE advanced=true AND custom=false AND sector=?"
);

const getCustomMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE custom=true"
);

export async function getDailyMissions(teamId: number) {
	let dailyMissions: Mission[] = [];
	// 12 normal missions, max 2 of one kind
	dailyMissions.push(getNormalMissionsQuery.get());

	let sec1 = Sector.diet;
	let sec2 = Sector.energy;
	//2 sector missions
	//dailyMissions.push(getAdvancedMissionsQuery.get(sec1));
	//dailyMissions.push(getNormalMissionsQuery.get(sec2));

	//+? Custom missions
	dailyMissions.push(getNormalMissionsQuery.get());

	return dailyMissions;
}

export function readMissionsFromFile() {
	let file = readFileSync("missions.txt", "utf-8");
	if (!file) throw new Error();
	//console.log(file);

	//Sektor(.*)\n(.*\n)*?(?=Sektor)
	const sections = /Sektor(?<name>.*)\n(?<tasks>(.*\n)*?(?=Sektor))/gm.exec(
		file
	);
	if (!sections) throw new Error();
	sections.forEach((section) => {
		const missions = /Aufgabe (\d): (?<title>.*)\n(?<description>(.*\n)*?(?=Aufgabe))/.exec(
			section[1]
		);
		if (!missions) throw new Error();
	});
}
