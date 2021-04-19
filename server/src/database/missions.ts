import { database } from "./core";
import { readFileSync } from "fs";

export enum Sector {
	diet = "Ernährung",
	energy = "Energie",
	household = "Haushalt",
	mobility = "Mobilität",
	social = "Soziales",
	key = "Schlüsselereignis",
}

export class Mission {
	name: string;
	description: string;
	score: number;
	sector: Sector;
	creatorId: number; //default: empty

	constructor(
		name: string,
		description: string,
		score: number,
		sector: Sector,
		creatorId: number
	) {
		this.name = name;
		this.description = description;
		this.score = score;
		this.sector = sector;
		this.creatorId = creatorId;
	}

	getImagePath() {
		let imagePath = "";
		switch (this.sector) {
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
		if (this.score > 4) imagePath += "-advanced";
		imagePath += ".jpg";
		return imagePath;
	}
	isCustom() {
		return this.creatorId != -1;
	}

	isValid() {
		if (this.score < 0 || this.score > 5) return false;
		if (this.creatorId < -1) return false;
		if (this.score == null) return false;
		if (
			this.score != 1 &&
			this.score != 2 &&
			this.score != 3 &&
			this.score != 4 &&
			this.score != 5
		)
			return false;
		return true;
	}
}

const createMissionQuery = database.prepare<
	[string, string, number, Sector, number]
>(
	"INSERT INTO missions (name, description, score, sector, creatorId) VALUES (?, ?, ?, ?, ?)"
);

export async function createTestMission() {
	createMissionQuery.run("Test", "please test this", 5, Sector.diet, 0);
}

export async function writeMissionInDB(mission: Mission) {
	await createMissionQuery.run(
		mission.name,
		mission.description,
		mission.score,
		mission.sector,
		mission.creatorId
	);
}

const getNormalMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE score<5 AND creatorId=-1"
);

const getAdvancedMissionsQuery = database.prepare<String>(
	"SELECT * FROM missions WHERE score>4 AND creatorId=-1 AND sector=?"
);

const getCustomMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE creatorId=-1"
);

export async function getDailyMissions(teamId: number) {
	let dailyMissions: Mission[] = [];
	// 12 normal missions, max 2 of one kind
	let missionPos: number[] = [];
	let normalMissions = getNormalMissionsQuery.all();
	dailyMissions.push();
	for (let i = 0; i < 12; i++) {
		let mission = Math.floor(Math.random() * normalMissions.length);
		//checks if there's the same mission 3 times in the list
		while (
			missionPos.indexOf(
				mission,
				missionPos.indexOf(mission, missionPos.indexOf(mission))
			) > -1
		)
			mission = Math.floor(Math.random() * normalMissions.length);
		missionPos.push(mission);
	}

	missionPos.forEach((m: number) => {
		normalMissions[m];
		dailyMissions.push(normalMissions[m]);
	});

	let sec1 = Sector.diet;
	let sec2 = Sector.energy;
	//2 sector advanced missions
	let advMissions1 = getAdvancedMissionsQuery.all(sec1.toString());
	dailyMissions.push(
		advMissions1[Math.floor(Math.random() * advMissions1.length)]
	);
	let advMissions2 = getAdvancedMissionsQuery.all(sec2.toString());
	dailyMissions.push(
		advMissions2[Math.floor(Math.random() * advMissions2.length)]
	);
	//+? Custom missions
	let custMissions = getCustomMissionsQuery.all();
	dailyMissions.push(
		custMissions[Math.floor(Math.random() * custMissions.length)]
	);

	return dailyMissions;
}

export async function readMissionsFromFile() {
	let file = readFileSync("missions.txt", "utf-8");
	if (!file) throw new Error();

	let sectors = file.split("Sektor");
	sectors.forEach((s) => {
		if (s == "") return;
		let sectorname = s.split("\r\n", 1)[0].replace(" ", "");
		let tasks = s.split("Aufgabe");
		tasks.shift();
		tasks.forEach(async (t) => {
			t = t.split(": ")[1];
			let title = t.split("\r\n")[0];
			let description = t.replace(title, "").replace("\r\n", "");
			let score = parseInt(description.split(" Punkte")[0].slice(-1));
			let m = new Mission(
				title,
				description,
				score,
				(sectorname as unknown) as Sector,
				-1
			);
			if (!m.isValid()) throw new Error();

			await writeMissionInDB(m);
		});
	});
}
