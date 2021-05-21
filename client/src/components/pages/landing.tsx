import React from "react";
import { Container } from "react-bootstrap";

export function Landing() {
  return (
    <>
      <br />

      <video
        width="800"
        height="450"
        controls
        src="/this-is-mf.mp4"
        className="center"
      ></video>
      <br />
      <br />
      <h2>Spiele, um mit deinem Team eure Parallelwelt aufzubauen.</h2>
      <br />
      <h2 className="center">
        Erledige Missionen, um Punkte für den Aufbau zu generieren.
      </h2>
      <br />
      <h2>Entscheidet, auf welche Sektoren ihr euch spezialisieren wollt.</h2>
      <img
        src="/img/planet/edre.png"
        className="center"
        height="600px"
        width="600px"
      />
    </>
  );
}
