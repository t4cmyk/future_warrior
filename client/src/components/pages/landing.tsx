import React from "react";
import { Container } from "react-bootstrap";

export function Landing() {
  return (
    <>
      <br />
      <Container>
        <img src="placeholder.jpg" />
        <br />
        <h2>Spiele, um mit deinem Team eure Parallelwelt aufzubauen.</h2>
        <br />
        <img src="img/utopia/planet.png" height="100" width="100" />
        <br />
        <h2>Erledige Missionen, um Punkte für den Aufbau zu generieren.</h2>
        <br />
        <h3>[Bild Missionskarte]</h3>
        <br />
        <h2>Entscheidet, auf welche Sektoren ihr euch spezialisieren wollt.</h2>
        <br />
        <img src="img/missions/diet.png" height="100" width="100" />
        <img src="img/missions/energy.png" height="100" width="100" />
        <img src="img/missions/household.png" height="100" width="100" />
        <img src="img/missions/mobility.png" height="100" width="100" />
        <img src="img/missions/social.png" height="100" width="100" />
        <br />
        <a href="/#/Register">
          <button>Registrieren</button>
        </a>
        <a href="/#/Login">
          <button>Einloggen</button>
        </a>
      </Container>
    </>
  );
}
