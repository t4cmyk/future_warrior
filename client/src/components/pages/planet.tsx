import React, { useEffect, useRef, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { getToken } from "../../core/authentication";
import { useImage } from "../../core/util";
import {
  drawHappinessPoints,
  drawPlanet,
  getPlanetDescription,
  IPlanetInfo,
} from "../planetElements";

export interface IPlanetImages {
  edre: HTMLImageElement;
  rainbow: HTMLImageElement;
  energy: HTMLImageElement;
  diet: HTMLImageElement;
  household: HTMLImageElement;
  social: HTMLImageElement;
  mobility: HTMLImageElement;
  clouds: HTMLImageElement;
}

export function Planet() {
  const inputEnergy = useRef<HTMLInputElement>(null);
  const inputDiet = useRef<HTMLInputElement>(null);
  const inputMobility = useRef<HTMLInputElement>(null);
  const inputSocial = useRef<HTMLInputElement>(null);
  const inputHousehold = useRef<HTMLInputElement>(null);
  const canvasPlanet = useRef<HTMLCanvasElement>();
  const canvasHappinessPoints = useRef<HTMLCanvasElement>();
  let description =
    "Erreiche ein höheres Level um die Sektoren freizuschalten.";
  const happyImg = useImage("img/planet/happiness.png");
  const edreImg = useImage("img/planet/edre.png");
  const rainbowImg = useImage("img/planet/rainbow.png");
  const energyImg = useImage("img/planet/energy.png");
  const dietImg = useImage("img/planet/diet.png");
  const householdImg = useImage("img/planet/household.png");
  const socialImg = useImage("img/planet/social.png");
  const mobilityImg = useImage("img/planet/mobility.png");
  const cloudsImg = useImage("img/planet/clouds.png");
  let planetImages = {
    edre: edreImg,
    rainbow: rainbowImg,
    energy: energyImg,
    diet: dietImg,
    household: householdImg,
    social: socialImg,
    mobility: mobilityImg,
    clouds: cloudsImg,
  };
 

  const [planetInfo, setPlanetInfo] = useState<IPlanetInfo>();
  useEffect(() => {
    const resultHandler = { onFetch: setPlanetInfo };
    const fetchSectors = async () => {
      try {
        const resp = await fetch(`/planetData?token=${getToken()}`);
        const respData = (await resp.json()) as IPlanetInfo;
        setPlanetInfo(respData);
        description = getPlanetDescription(respData.level);
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

  useEffect(() => {
    let planetCon = canvasPlanet.current.getContext("2d");
    let happyCon = canvasHappinessPoints.current.getContext("2d");
    drawPlanet(planetCon, planetInfo, planetImages);
    drawHappinessPoints(canvasHappinessPoints, happyCon, 10, happyImg);
  }, [
    happyImg,
    edreImg,
    rainbowImg,
    energyImg,
    dietImg,
    householdImg,
    socialImg,
    mobilityImg,
    cloudsImg,
    planetInfo,
  ]);

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
            <canvas ref={canvasHappinessPoints} height="0" width="0"></canvas>
            <br />
            <br />
            <ListGroup>
              <ListGroup.Item className="listgrouphead">
                {description}
              </ListGroup.Item>
              <ListGroup.Item>
                <input
                  type="checkbox"
                  ref={inputEnergy}
                  disabled={true}
                ></input>
                Energie
              </ListGroup.Item>
              <ListGroup.Item>
                <input type="checkbox" ref={inputDiet} disabled={true}></input>
                Ernährung
              </ListGroup.Item>
              <ListGroup.Item>
                <input
                  type="checkbox"
                  ref={inputMobility}
                  disabled={true}
                ></input>
                Mobilität
              </ListGroup.Item>
              <ListGroup.Item>
                <input
                  type="checkbox"
                  ref={inputSocial}
                  disabled={true}
                ></input>
                Soziales
              </ListGroup.Item>
              <ListGroup.Item>
                <input
                  type="checkbox"
                  ref={inputHousehold}
                  disabled={true}
                ></input>
                Haushalt
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
