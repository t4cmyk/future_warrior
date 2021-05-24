import { useEffect } from "react";
import { useImage } from "../core/util";
import { IPlanetImages, ISectorCheckboxesRefs } from "./pages/planet";
import { isAnySectorEqualString } from "./pages/sectorSelection";

export interface IPlanetInfo {
  level: number; // 1 -default, 2 - one sector, 3 - two sectors, 4 - three sectors
  sector1: string;
  sector2: string;
  sector3: string;
  happiness: number;
}

// level 1: 0 - 54
// level 2: 55 - 119 Sec1
// level 3: 120 - 194 Sec2
// level 4/Endgame: 195 - 280 Sec3

export enum Sector {
  diet = "Ernährung",
  energy = "Energie",
  household = "Haushalt",
  mobility = "Mobilität",
  social = "Soziales",
  key = "Schlüsselereignis",
}

export function writePlanetDescription(planetInfo: any, description: any) {
  if (planetInfo == null) return;
  let text = "";
  switch (planetInfo.level) {
    case 1:
      text = "Erreiche ein höheres Level um die Sektoren freizuschalten.";
      break;
    case 2:
      text = "Erreiche ein höheres Level um weitere Sektoren freizuschalten.";
      break;
    case 3:
      text = "Erreiche ein höheres Level um weitere Sektoren freizuschalten.";
      break;
    case 4:
      text = "Sammel mehr Punkte um mehr Happiness Points freizuschalten.";
      break;
  }
  description.current.innerText = text;
}

export function drawHappinessPoints(
  happyCan: any,
  happyCon: any,
  happiness: number,
  happyImg: any
) {
  const imgSize = 50;
  const rows = 4;
  if (!happyImg) return;

  let width = happiness >= rows ? imgSize * 4 : imgSize * happiness;
  let height = imgSize * Math.ceil(happiness / rows);
  happyCan.current.width = width;
  happyCan.current.height = height;

  happyCon.clearRect(0, 0, width, height);

  for (let i = 0; i < happiness; i++) {
    let x = (i % rows) * imgSize;
    let y = Math.floor(i / rows) * imgSize;
    happyCon.drawImage(happyImg, x, y, imgSize, imgSize);
  }
}

// draw order:
// rainbow -> edre -> energy ->diet ->household -> social -> mobility? -> clouds

export function drawPlanet(
  planetCon: any,
  planetInfo: IPlanetInfo,
  images: IPlanetImages
) {
  if (
    !planetInfo ||
    !images.rainbow ||
    !images.edre ||
    !images.energy ||
    !images.diet ||
    !images.household ||
    !images.social ||
    !images.mobility ||
    !images.clouds
  )
    return;

  var tempImg = new Image();
  planetCon.clearRect(0, 0, 400, 400);
  tempImg.src = "img/planet/edre.png";
  console.log(tempImg.src);
  planetCon.drawImage(images.edre, 0, 0, 400, 400);
  if (planetInfo == undefined) {
    console.log("Error - planetInfo not found");
    return;
  }
  if (planetInfo.level == 4) {
    var tempImg = new Image();
    tempImg.src = "img/planet/rainbows.png";
    planetCon.drawImage(images.rainbow, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.energy ||
    planetInfo.sector2 == Sector.energy ||
    planetInfo.sector3 == Sector.energy
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/energy.png";
    planetCon.drawImage(images.energy, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.diet ||
    planetInfo.sector2 == Sector.diet ||
    planetInfo.sector3 == Sector.diet
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/diet.png";
    planetCon.drawImage(images.diet, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.household ||
    planetInfo.sector2 == Sector.household ||
    planetInfo.sector3 == Sector.household
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/household.png";
    planetCon.drawImage(images.household, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.social ||
    planetInfo.sector2 == Sector.social ||
    planetInfo.sector3 == Sector.social
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/social.png";
    planetCon.drawImage(images.social, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.mobility ||
    planetInfo.sector2 == Sector.mobility ||
    planetInfo.sector3 == Sector.mobility
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/mobility.png";
    planetCon.drawImage(images.mobility, 0, 0, 400, 400);
  }

  if (planetInfo.level == 4) {
    var tempImg = new Image();
    tempImg.src = "img/planet/clouds.png";
    planetCon.drawImage(images.clouds, 0, 0, 400, 400);
  }

  // rainbow -> edre -> energy ->diet ->household -> social -> mobility? -> clouds
}

export function checkSectorInputBoxes(
  refs: ISectorCheckboxesRefs,
  planetInfo: IPlanetInfo
) {
  if (planetInfo == undefined) return;
  if (isAnySectorEqualString(planetInfo, Sector.energy))
    refs.energy.current.checked = true;
  if (isAnySectorEqualString(planetInfo, Sector.diet))
    refs.diet.current.checked = true;
  if (isAnySectorEqualString(planetInfo, Sector.household))
    refs.household.current.checked = true;
  if (isAnySectorEqualString(planetInfo, Sector.mobility))
    refs.mobility.current.checked = true;
  if (isAnySectorEqualString(planetInfo, Sector.social))
    refs.social.current.checked = true;
}
