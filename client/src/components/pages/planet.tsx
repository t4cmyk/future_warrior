import React, { useEffect, useRef, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { getToken } from "../../core/authentication";
import { drawPlanet, IPlanetInfo } from "../planetElements";



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
        description = getDescription(respData.level);
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


function getDescription(level: number): string {
  throw new Error("Function not implemented.");
}

