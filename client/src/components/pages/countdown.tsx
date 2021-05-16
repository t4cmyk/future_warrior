import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

//double-digits
function dd(i: number) {
  if (i < 10) return "0" + i;
  return i;
}

export function Countdown() {
  const timerRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLHeadingElement>(null);
  let time = "Bald geht's los!";
  let gameStart = new Date("2021-05-23T20:00:00");
  let clock = setInterval(function () {
    let dist = gameStart.getTime() - new Date().getTime();
    let days = Math.floor(dist / (1000 * 60 * 60 * 24));
    let hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((dist % (1000 * 60)) / 1000);
    time = days + " Tage " + dd(hours) + ":" + dd(minutes) + ":" + dd(seconds);
    if (dist <= 0) {
      clearInterval(clock);
      time = "Das Spiel beginnt in wenigen Augenblicken!";
      captionRef.current.innerText = "";
    }
    if(timerRef.current == null) return;
    timerRef.current.innerText = time;
  }, 500);

  return (
    <>
      <br />
      <h1 ref={timerRef}>? Tage ??:??:??</h1>
      <br />
      <h3 ref={captionRef}>bis zum Spielbeginn</h3>
      <br />
      <br />
      <Link to="Tutorial">
        <Button className="center">Zurück zum Tutorial</Button>
      </Link>
    </>
  );
}
