import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface IMission {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  completedByPlayer: number | null;
  score: number;
  sector: string;
  creatorId?: number;
}

const missionCache = new Map<number, IMission>();
const loadMissionCallbacks = new Map<number, ((m: IMission) => any)[]>();

export function useMissionData(missionId: number) {
  const [missionData, setMissionData] = useState(
    missionCache.has(missionId) ? missionCache.get(missionId) : undefined
  );
  useEffect(() => {
    if (missionData) return;
    const loadMission = !loadMissionCallbacks.has(missionId);
    if (loadMission) {
      const callbacks = new Array<(m: IMission) => any>();
      loadMissionCallbacks.set(missionId, callbacks);
    }
    const callbacks = loadMissionCallbacks.get(missionId);
    callbacks.push(setMissionData);
    if (loadMission) {
      fetch(`/Mission/${missionId}`)
        .then((data) => data.json())
        .then((missionData) => {
          callbacks.forEach((cb) => cb(missionData));
          missionCache.set(missionId, missionData);
          loadMissionCallbacks.delete(missionId);
        });
    }
    return () => {
      callbacks[callbacks.indexOf(setMissionData)] =
        callbacks[callbacks.length - 1];
      callbacks.pop();
    };
  }, []);
  return missionData;
}

export function MissionCard(props: { missionsId: number }) {
  const data = useMissionData(props.missionsId);
  if (data) return <MissionCardFromData mission={data} />;
  return <></>;
}

function MissionCardFromData(props: { mission: IMission }) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>
        <h4>{props.mission.name}</h4>
      </Card.Header>
      <Card.Body>
        <Card.Img variant="top" src={props.mission.imagePath} />
        <Card.Title>{`Sektor: ${props.mission.sector}`}</Card.Title>
        <Card.Text>{props.mission.description}</Card.Text>
        {props.mission.completedByPlayer != null ? (
          <Button variant="primary" className="w-100" disabled>
            Mission abgeschlossen
          </Button>
        ) : (
          <Link to={`/MissionComplete/${props.mission.id}`}>
            <Button variant="primary" className="w-100">
              Mission abschließen
            </Button>
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}
