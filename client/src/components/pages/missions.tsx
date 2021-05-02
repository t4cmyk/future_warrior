import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Carousel } from "../carousel";

interface IMission {
  id: number;
  name: string;
  description: string;
  src: string;
  score: number;
  creatorId?: number;
}

const missionList = [
  {
    id: 1,
    name: "Mission 1",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
    src: "img/missions/diet.png",
    score: 10,
  },
  {
    id: 2,
    name: "Mission 2",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
    src: "img/missions/energy.png",
    score: 10,
  },
  {
    id: 3,
    name: "Mission 3",
    description:
      "Some quick example text to build on the card title and make up the bulk of the card's content.",
    src: "img/missions/social.png",
    score: 10,
  },
];

function MissionCard(props: { mission: IMission }) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img variant="top" src={props.mission.src} />
      <Card.Body>
        <Card.Title>{props.mission.name}</Card.Title>
        <Card.Text>{props.mission.description}</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

missionList.push(...missionList);
missionList.push(...missionList);

function ControlledCarousel() {
  return (
    <Carousel<IMission>
      angle={-60}
      dist={-150}
      shift={10}
      height={520}
      width={288}
      timeConstant={250}
      render={(elem) => <MissionCard mission={elem} />}
      onContextMenu={() => {}}
      onDoubleClick={() => {}}
      elementList={missionList}
    ></Carousel>
  );
}

export function Missions() {
  return (
    <>
      <h1>Missionen</h1>
      <br />
      <br />
      <ControlledCarousel />
    </>
  );
}
