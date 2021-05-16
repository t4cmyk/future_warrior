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
// Endgame: 195 - 280 Sec3

export enum Sector {
  diet = "Ernährung",
  energy = "Energie",
  household = "Haushalt",
  mobility = "Mobilität",
  social = "Soziales",
  key = "Schlüsselereignis",
}

export function getPlanetDescription(level: number) {
  switch (level) {
    case 1:
      return "Erreiche ein höheres Level um die Sektoren freizuschalten.";
    case 2:
      return "Erreiche ein höheres Level um weitere Sektoren freizuschalten.";
    case 3:
      return "Erreiche ein höheres Level um weitere Sektoren freizuschalten.";
    case 4:
      return "Sammel mehr Punkte um mehr Happiness Points freizuschalten.";
  }
  console.log(level);
  return "Es ist ein Fehler aufgetreten";
}

export function drawHappinessPoints(happyCon: any, happiness: number) {}

// draw order:
// rainbow -> edre -> energy ->diet ->household -> social -> mobility? -> clouds

export function drawPlanet(planetCon: any, planetInfo: IPlanetInfo) {
  var tempImg = new Image();
  planetCon.clearRect(0, 0, 400, 400);
  tempImg.src = "img/planet/edre.png";
  console.log(tempImg.src);
  planetCon.drawImage(tempImg, 0, 0, 400, 400);
  if (planetInfo == undefined) {
    console.log("Error - planetInfo not found");
    return;
  }
  if (planetInfo.level == 4) {
    var tempImg = new Image();
    tempImg.src = "img/planet/rainbows.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.energy ||
    planetInfo.sector2 == Sector.energy ||
    planetInfo.sector3 == Sector.energy
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/energy.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.diet ||
    planetInfo.sector2 == Sector.diet ||
    planetInfo.sector3 == Sector.diet
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/diet.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.household ||
    planetInfo.sector2 == Sector.household ||
    planetInfo.sector3 == Sector.household
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/household.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.social ||
    planetInfo.sector2 == Sector.social ||
    planetInfo.sector3 == Sector.social
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/social.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.mobility ||
    planetInfo.sector2 == Sector.mobility ||
    planetInfo.sector3 == Sector.mobility
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/mobility.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }

  if (planetInfo.level == 4) {
    var tempImg = new Image();
    tempImg.src = "img/planet/clouds.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
}
