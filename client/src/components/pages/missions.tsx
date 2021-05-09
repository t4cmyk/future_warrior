import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { getToken } from "../../core/authentication";
import { Carousel } from "../carousel";

export interface IMission {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  completedByPlayer: number;
  score: number;
  sector: string;
  creatorId?: number;
}

function MissionCard(props: { mission: IMission }) {
  const href = `/#/MissionComplete/${btoa(
    encodeURI(JSON.stringify(props.mission))
  )}`;

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>
        <h4>{props.mission.name}</h4>
      </Card.Header>
      <Card.Body>
        <Card.Img variant="top" src={props.mission.imagePath} />
        <Card.Title>{`Sektor: ${props.mission.sector}`}</Card.Title>
        <Card.Text>{props.mission.description}</Card.Text>
        <Button variant="primary" className="w-100" href={href}>
          Missions abschließen
        </Button>
      </Card.Body>
    </Card>
  );
}

function ControlledCarousel(props: { missions: IMission[] }) {
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
      elementList={props.missions}
    ></Carousel>
  );
}

export function Missions() {
  const [missions, setMissions] = useState<IMission[]>([]);
  useEffect(() => {
    const resultHandler = { onFetch: setMissions };
    const fetchMissions = async () => {
      try {
        const resp = await fetch(`/missions?token=${getToken()}`);
        const respData = await resp.json();
        return respData as IMission[];
      } catch (e) {
        console.log(e);
      }
      return [];
    };
    fetchMissions().then((result) => resultHandler.onFetch(result));
    return () => {
      resultHandler.onFetch = (_: any[]) => {};
    };
  }, []);

  return (
    <>
      <h1>Missionen</h1>
      <br />
      <br />
      <ControlledCarousel missions={missions} />
    </>
  );
}
