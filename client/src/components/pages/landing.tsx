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
        src="trailer.mp4"
        className="center"
      >
      </video>
      <br />
 
      <img src="img/utopia/planet.png" className="center" />
      <h2>
        Spiele, um mit deinem Team eure Parallelwelt aufzubauen.
      </h2>
      <br />
      <br />
      <h3>[Bild Missionskarte]</h3>
      <br />
      <h2 className="center">
        Erledige Missionen, um Punkte für den Aufbau zu generieren.
      </h2>
      <br />
      
      <Container className="justify-content-center col-12 d-flex">
        <img src="img/missions/diet.png" height="200" width="200" />
        <img src="img/missions/energy.png" height="200" width="200" />
        <img src="img/missions/household.png" height="200" width="200" />
        <img src="img/missions/mobility.png" height="200" width="200" />
        <img src="img/missions/social.png" height="200" width="200" />
      </Container>
      <br />
      <h2>
        Entscheidet, auf welche Sektoren ihr euch spezialisieren wollt.
      </h2>
      <br />
      <a href="/#/Register">
        <button>Registrieren</button>
      </a>
      <a href="/#/Login">
        <button>Einloggen</button>
      </a>
    </>
  );
}
