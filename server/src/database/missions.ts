import { database } from "./core";
import { readFileSync, writeFileSync } from "fs";
import { getSectorsFromTeamId } from "./team";
import { convertJsToSQLDate, convertSQLToJsDate, getStartOfDay } from "../util";
import { isKeyMissionFromTeamFinished } from "./keyMission";

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
			imagePath += ".png";
			return imagePath;
	}
	if (score > 4) imagePath += "-advanced";
	imagePath += ".png";
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

const clearMissionsQuery = database.prepare("DELETE FROM missions");

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

const selectMissionDetails = database.prepare<number>(
	"SELECT name, description, score,sector,creatorId FROM missions WHERE id=?"
);

export function getMissionData(id: number) {
	const data = selectMissionDetails.get(id);

	if (data) {
		data.imagePath = getImagePath(data.sector, data.score);
		return data as {
			name: string;
			description: string;
			score: number;
			sector: Sector;
			creatorId: number;
		};
	}
	return undefined;
}

const getAllMissionsQuery = database.prepare("SELECT * FROM missions");

const getNormalMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE score<5 AND creatorId=-1"
);

const getAdvancedMissionsQuery = database.prepare<String>(
	"SELECT * FROM missions WHERE score>4 AND creatorId=-1 AND sector=?"
);

const getKeyMissionQuery = database.prepare(
	"SELECT * FROM missions WHERE sector='Schlüsselereignis'"
);

const getCustomMissionsQuery = database.prepare(
	"SELECT * FROM missions WHERE creatorId>-1"
);

const getLastDailyUpdateQuery = database.prepare<number>(
	"SELECT lastDailyUpdate FROM teams WHERE id=?"
);

const setLastDailyUpdateQuery = database.prepare<[String, number]>(
	"UPDATE teams SET lastDailyUpdate = ? WHERE id=?"
);

function getLastDailyUpdate(team: number) {
	return getLastDailyUpdateQuery.get(team);
}

function setLastDailyUpdate(team: number, date: Date) {
	setLastDailyUpdateQuery.run(convertJsToSQLDate(date), team);
}

const getDailyMissionsForTeam = database.prepare<number>(
	"SELECT id,mission,completedByPlayer FROM dailyMissions WHERE team=?"
);

export function getDailyMissions(teamId: number) {
	let d = getLastDailyUpdate(teamId);

	if (d.lastDailyUpdate == null) {
		pickDailyMissions(teamId);
		setLastDailyUpdate(teamId, new Date());
	} else if (
		convertSQLToJsDate(d.lastDailyUpdate).getTime() <
		getStartOfDay(new Date()).getTime()
	) {
		pickDailyMissions(teamId);
		setLastDailyUpdate(teamId, new Date());
	}

	const missions: {
		id: number;
		mission: number;
		completedByPlayer: number | null;
	}[] = getDailyMissionsForTeam.all(teamId);

	return missions;
}

export async function pickDailyMissions(teamId: number) {
	let sec1 = getSectorsFromTeamId(teamId).sector1;
	let sec2 = getSectorsFromTeamId(teamId).sector2;
	let sec3 = getSectorsFromTeamId(teamId).sector3;
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
	//collect 2 random missions for each advanced sector
	let advancedMissions: Mission[] = [];
	if (sec1 != null) {
		let advMissions1 = getAdvancedMissionsQuery.all(sec1.toString());
		advMissions1.forEach((m) => advancedMissions.push(m));
	}

	if (sec2 != null) {
		let advMissions1 = getAdvancedMissionsQuery.all(sec2.toString());
		advMissions1.forEach((m) => advancedMissions.push(m));
	}

	if (sec3 != null) {
		let advMissions1 = getAdvancedMissionsQuery.all(sec3.toString());
		advMissions1.forEach((m) => advancedMissions.push(m));
	}
	// add 2 of the random advanced missions to the pool
	if (advancedMissions.length > 0) {
		dailyMissions.push(
			advancedMissions[Math.floor(Math.random() * advancedMissions.length)]
		);
		dailyMissions.push(
			advancedMissions[Math.floor(Math.random() * advancedMissions.length)]
		);
	}
	//+? Custom missions
	let custMissions = getCustomMissionsQuery.all();
	if (custMissions.length > 0)
		dailyMissions.push(
			custMissions[Math.floor(Math.random() * custMissions.length)]
		);

	if (!isKeyMissionFromTeamFinished(teamId)) {
		let keyMission = getKeyMissionQuery.get();
		dailyMissions.push(keyMission);
	}

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
