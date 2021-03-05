import React, { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";

export function Utopia() {
  const inputPeace = useRef<HTMLInputElement>(null);
  const inputCleanAir = useRef<HTMLInputElement>(null);
  const canvasPlanet = useRef<HTMLCanvasElement>(null);

  const drawPlanet = () => {
    var planetCon = canvasPlanet.current.getContext("2d");
    var tempImg = new Image();
    planetCon.clearRect(0, 0, 400, 400);
    tempImg.src = "img/utopia/planet.png";
    planetCon.drawImage(tempImg, 0, 0, 400, 400);
    if (inputPeace.current.checked) {
      var tempImg = new Image();
      tempImg.src = "img/utopia/peace.png";
      planetCon.drawImage(tempImg, 0, 0, 400, 400);
    }
    if (!inputCleanAir.current.checked) {
      var tempImg = new Image();
      tempImg.src = "img/utopia/factory.png";
      planetCon.drawImage(tempImg, 0, 0, 400, 400);
      var tempImg = new Image();
      tempImg.src = "img/utopia/badAir.png";
      planetCon.drawImage(tempImg, 0, 0, 400, 400);
    }
  };
  return (
    <>
      <h1>Unser Utopia</h1>
      <Container>
        <Row>
          <Col>
            {" "}
            <canvas
              ref={canvasPlanet}
              height="400"
              width="400"
              style={{
                border: "1px solid #000000",
              }}
            ></canvas>
          </Col>
          <Col>
            <Container>
              <Row>
                <input
                  type="checkbox"
                  ref={inputPeace}
                  onClick={drawPlanet}
                ></input>
                Frieden
              </Row>
              <Row>
                <input
                  type="checkbox"
                  ref={inputCleanAir}
                  onClick={drawPlanet}
                ></input>
                Saubere Luft
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
