import React, { Component, useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  ListGroup,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { getToken } from "../../core/authentication";

export interface IPlanetInfo {
  level: number; // 1 -default, 2 - one sector, 3 - two sectors
  sector1: string;
  sector2: string;
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

function drawPlanet(planetCon: any, planetInfo: IPlanetInfo) {
  var tempImg = new Image();
  planetCon.clearRect(0, 0, 400, 400);
  tempImg.src = "img/planet/edre.png";
  console.log(tempImg.src);
  planetCon.drawImage(tempImg, 0, 0, 400, 400);
  if (planetInfo == undefined) {
    console.log("Error - planetInfo not found");
    return;
  }
  if (
    planetInfo.sector1 == Sector.energy ||
    planetInfo.sector2 == Sector.energy
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/energy.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (planetInfo.sector1 == Sector.diet || planetInfo.sector2 == Sector.diet) {
    var tempImg = new Image();
    tempImg.src = "img/planet/diet.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.household ||
    planetInfo.sector2 == Sector.household
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/household.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.social ||
    planetInfo.sector2 == Sector.social
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/social.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
  if (
    planetInfo.sector1 == Sector.mobility ||
    planetInfo.sector2 == Sector.mobility
  ) {
    var tempImg = new Image();
    tempImg.src = "img/planet/mobility.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }

  if ("todo") {
    var tempImg = new Image();
    tempImg.src = "img/planet/happiness.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
  }
}

export function Planet() {
  const inputEnergy = useRef<HTMLInputElement>(null);
  const inputDiet = useRef<HTMLInputElement>(null);
  const inputMobility = useRef<HTMLInputElement>(null);
  const inputSocial = useRef<HTMLInputElement>(null);
  const inputHousehold = useRef<HTMLInputElement>(null);
  const canvasPlanet = useRef<HTMLCanvasElement>();
  let description =
    "Erreiche ein höheres Level um die Sektoren freizuschalten.";

  const [planetInfo, setPlanetInfo] = useState<IPlanetInfo>();
  useEffect(() => {
    const resultHandler = { onFetch: setPlanetInfo };
    const fetchSectors = async () => {
      try {
        const resp = await fetch(`/planet?token=${getToken()}`);
        const respData = (await resp.json()) as IPlanetInfo;
        let planetCon = canvasPlanet.current.getContext("2d");
        drawPlanet(planetCon, respData);
        setTimeout(function () {
          drawPlanet(planetCon, respData);
        }, 100);
        return respData;
      } catch (e) {
        console.log(e);
      }
      return;
    };
    fetchSectors().then((result) => resultHandler.onFetch(result));
    return () => {
      resultHandler.onFetch = (_: any) => {}; //this never happens
    };
  }, []);

  // draw order:
  // good
  // edre

  // energy
  // diet
  // household
  // social

  //mobility?

  // clouds

  return (
    <>
      <h1>Unsere edrE</h1>
      <Container>
        <Row>
          <Col>
            {" "}
            <canvas ref={canvasPlanet} height="400" width="400"></canvas>
          </Col>
          <Col>
            <br />
            <br />
            <ListGroup>
              <ListGroup.Item className="listgrouphead">
                {description}
              </ListGroup.Item>
              <ListGroup.Item>
                <input type="checkbox" ref={inputEnergy}></input>
                Energie
              </ListGroup.Item>
              <ListGroup.Item>
                <input type="checkbox" ref={inputDiet}></input>
                Ernährung
              </ListGroup.Item>
              <ListGroup.Item>
                <input type="checkbox" ref={inputMobility}></input>
                Mobilität
              </ListGroup.Item>
              <ListGroup.Item>
                <input type="checkbox" ref={inputSocial}></input>
                Soziales
              </ListGroup.Item>
              <ListGroup.Item>
                <input type="checkbox" ref={inputHousehold}></input>
                Soziales
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>

      <br />

      <br />
    </>
  );
}
