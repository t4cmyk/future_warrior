import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Tutorial() {
  return (
    <>
      <h1>Tutorial</h1>
      <video
        width="800"
        height="450"
        controls
        src="/tutorial.mp4"
        className="center"
      ></video>
      <br />
      <Link to="/Countdown">
        <Button className="center">Alles klar, los geht's!</Button>
      </Link>
    </>
  );
}
