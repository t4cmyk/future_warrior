import React, { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

export function Planet() {
  const inputEnergy = useRef<HTMLInputElement>(null);
  const inputDiet = useRef<HTMLInputElement>(null);
  const canvasPlanet = useRef<HTMLCanvasElement>(null);

  // draw order:
  // good
  // edre
  // energy
  // food
  // household
  // communication
  // clouds

  const drawPlanet = () => {
    var planetCon = canvasPlanet.current.getContext("2d");
    var tempImg = new Image();
    planetCon.clearRect(0, 0, 400, 400);
    tempImg.src = "img/planet/edre.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
    if (inputEnergy.current.checked) {
      var tempImg = new Image();
      tempImg.src = "img/planet/energy.png";
      planetCon.drawImage(tempImg, 0, 0, 400, 400);
    }
    if (!inputDiet.current.checked) {
      var tempImg = new Image();
      tempImg.src = "img/planet/diet.png";
      planetCon.drawImage(tempImg, 0, 0, 400, 400);
    }
  };

  useEffect(() => drawPlanet(), []);

  return (
    <>
      <h1>Unsere edrE</h1>
      <Container>
        <Row>
          <Col>
            {" "}
            <canvas
              ref={canvasPlanet}
              height="400"
              width="400"
            ></canvas>
          </Col>
          <Col>
            <Container>
              <Row>
                <input
                  type="checkbox"
                  ref={inputEnergy}
                  onClick={drawPlanet}
                ></input>
                Energie
              </Row>
              <Row>
                <input
                  type="checkbox"
                  ref={inputDiet}
                  onClick={drawPlanet}
                ></input>
                Ernährung
              </Row>
              <Row>...</Row>
            </Container>
          </Col>
        </Row>
      </Container>

      <br />

      <br />
    </>
  );
}
