import { Request, Response } from "express";
import { Sector } from "../database/missions";
import { getTeamLevel } from "../database/score";
import {
	changePlayerSector,
	changeTeamSectors,
	checkTeamSectorChoice,
	getPlayerSector,
	getSectorsFromTeamId,
	getTeamIDFromUserId,
	resetPlayerSectorsOfTeam,
} from "../database/team";

export interface IPlanetInfo {
	level: number;
	sector1: string;
	sector2: string;
	sector3: string;
	happiness: number;
}

export async function sectorChoiceHandler(req: Request, resp: Response) {
	try {
		const user = req.currentUser.id;
		const sector = req.body.sector;

		if (
			sector != Sector.diet &&
			sector != Sector.energy &&
			sector != Sector.household &&
			sector != Sector.mobility &&
			sector != Sector.social &&
			sector != null
		)
			throw new Error();
		let result = false;
		const team = getTeamIDFromUserId(user);
		let teamSectors = getSectorsFromTeamId(team);
		let level = getTeamLevel(team);
		changePlayerSector(user, team, sector);
		let teamChoice = checkTeamSectorChoice(team);
		if (teamChoice != null) {
			if (level > 1 && teamSectors.sector1 == null) {
				changeTeamSectors(team, teamChoice, null, null);
				resetPlayerSectorsOfTeam(team);
				result = true;
			} else if (level > 2 && teamSectors.sector2 == null) {
				changeTeamSectors(team, teamSectors.sector1, teamChoice, null);
				resetPlayerSectorsOfTeam(team);
				result = true;
			} else if (level > 3 && teamSectors.sector3 == null) {
				changeTeamSectors(
					team,
					teamSectors.sector1,
					teamSectors.sector2,
					teamChoice
				);
				resetPlayerSectorsOfTeam(team);
				result = true;
			}
		}

		resp.status(200).json(result);
	} catch {
		resp.sendStatus(500);
	}
}

export async function sectorSelectionHandler(req: Request, resp: Response) {
	try {
		const user = req.currentUser.id;
		const team = getTeamIDFromUserId(user);
		if (team == null) throw new Error();
		let sectors = getSectorsFromTeamId(team);

		let result = {
			level: getTeamLevel(team),
			sector1: sectors.sector1,
			sector2: sectors.sector2,
			sector3: sectors.sector3,
			selectedSector: getPlayerSector(user, team).sector,
		};
		resp.status(200).json(result);
	} catch (error) {
		resp.sendStatus(500);
	}
}
