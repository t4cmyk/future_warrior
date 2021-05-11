import { database } from "./core";
import { readFileSync, writeFileSync } from "fs";
import { getSectorsFromTeamId } from "./team";
import { convertSQLToJsDate } from "../util";

export enum Sector {
	diet = "Ernährung",
	energy = "Energie",
	household = "Haushalt",
	mobility = "Mobilität",
	social = "Soziales",
	key = "Schlüsselereignis",
}

export class Mission {
	id: number;
	name: string;
	description: string;
	score: number;
	sector: Sector;
	creatorId: number; //default: -1

	constructor(
		id: number,
		name: string,
		description: string,
		score: number,
		sector: Sector,
		creatorId: number
	) {
		this.id = id;
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

interface MissionPackageForClient extends Mission {
	imagePath: string;
}

function getImagePath(sector: Sector, score: number) {
	let imagePath = "";
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
	if (score > 4) imagePath += "-advanced";
	imagePath += ".jpg";
	return imagePath;
}

const createMissionQuery = database.prepare<
	[string, string, number, Sector, number]
>(
	"INSERT INTO missions (name, description, score, sector, creatorId) VALUES (?, ?, ?, ?, ?)"
);

const clearDailyMissionsForTeamQuery = database.prepare<number>(
	"DELETE FROM dailyMissions WHERE team=?"
);

const createDailyMissionQuery = database.prepare<
	[number, number, number | null]
>(
	"INSERT INTO dailyMissions (team, mission, completedByPlayer) VALUES (?, ?, ?)"
);

export async function clearDailyMissionsForTeam(teamId: number) {
	clearDailyMissionsForTeamQuery.run(teamId);
}

export async function createDailyMission(
	teamId: number,
	missionId: number,
	playerId: number | null
) {
	createDailyMissionQuery.run(teamId, missionId, playerId);
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

const getAllMissionsQuery = database.prepare("SELECT * FROM missions");

const getNormalMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE score<5 AND creatorId=-1"
);

const getAdvancedMissionsQuery = database.prepare<String>(
	"SELECT * FROM missions WHERE score>4 AND creatorId=-1 AND sector=?"
);

const getCustomMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE creatorId=-1"
);

const getLastDailyUpdate = database.prepare<number>(
	"SELECT lastDailyUpdate FROM teams WHERE id=?"
);

const getDailyMissionsWithDescriptionQuery = database.prepare<number>(
	"SELECT dailyMissions.id, mission,completedByPlayer,name, description,score,sector,creatorId FROM dailyMissions INNER JOIN missions ON dailyMissions.mission=missions.id WHERE team=?"
);

export function getDailyMissions(teamId: number) {
	let d = getLastDailyUpdate.get(teamId);
	if (d.lastDailyUpdate == null) pickDailyMissions(teamId);
	else if (convertSQLToJsDate(d.lastDailyUpdate) < new Date())
		pickDailyMissions(teamId);
	const missions: {
		id: number;
		mission: number;
		completedByPlayer: number | null;
		name: string;
		description: string;
		score: number;
		sector: Sector;
		creatorId: number;
		imagePath: string;
	}[] = getDailyMissionsWithDescriptionQuery.all(teamId);
	missions.forEach((m) => {
		m.imagePath = getImagePath(m.sector, m.score);
	});

	return missions;
}

export async function pickDailyMissions(teamId: number) {
	let sec1 = getSectorsFromTeamId(teamId)[0].sector1;
	let sec2 = getSectorsFromTeamId(teamId)[0].sector2;
	clearDailyMissionsForTeamQuery.run(teamId);

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
	//2 sector advanced missions
	if (sec1 != null) {
		let advMissions1 = getAdvancedMissionsQuery.all(sec1.toString());
		dailyMissions.push(
			advMissions1[Math.floor(Math.random() * advMissions1.length)]
		);
	}

	if (sec2 != null) {
		let advMissions2 = getAdvancedMissionsQuery.all(sec2.toString());
		dailyMissions.push(
			advMissions2[Math.floor(Math.random() * advMissions2.length)]
		);
	}

	//+? Custom missions
	let custMissions = getCustomMissionsQuery.all();
	dailyMissions.push(
		custMissions[Math.floor(Math.random() * custMissions.length)]
	);

	dailyMissions.forEach((m) => {
		createDailyMission(teamId, m.id, null);
	});
}

export function readMissionsFromFile() {
	let file = readFileSync("missions.json", "utf-8");
	if (!file) throw new Error();

	const missionData: {
		sector: string;
		tasks: { title: string; description: string; score: number }[];
	}[] = JSON.parse(file);

	missionData.forEach((sector) => {
		sector.tasks.forEach((task) => {
			const m = new Mission(
				-1,
				task.title,
				task.description,
				task.score,
				sector.sector as Sector,
				-1
			);
			writeMissionInDB(m);
		});
	});
}

export function initMissions() {
	if (getAllMissionsQuery.all().length == 0) {
		console.log("no missions found -> read missions from file");
		readMissionsFromFile();
	}
}
