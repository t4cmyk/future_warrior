import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IDailyMissionData } from "./pages/missions";

export interface IMission {
  id: number;
  name: string;
  description: string;
  imagePath: string;
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
  const loadMission = () => {
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
  };
  useEffect(() => {
    if (missionData && missionData.id !== missionId) {
      const entry = missionCache.has(missionId)
        ? missionCache.get(missionId)
        : undefined;
      setMissionData(entry);
      if (!entry) return loadMission();
    }
  }, [missionId]);
  useEffect(() => {
    if (!missionData) return loadMission();
  }, []);
  return missionData;
}

export function MissionCard(props: {
  missionsId: number;
  dailyMission?: IDailyMissionData;
}) {
  const data = useMissionData(props.missionsId);
  if (data)
    return (
      <MissionCardFromData mission={data} dailyMission={props.dailyMission} />
    );
  return <></>;
}

function MissionCardFromData(props: {
  mission: IMission;
  dailyMission?: IDailyMissionData;
}) {
  return (
    <Card style={{ width: "338px" }}>
      <Card.Header>
        <h4>{props.mission.name}</h4>
      </Card.Header>
      <Card.Body>
        <Card.Img variant="top" src={props.mission.imagePath} />
        <Card.Title>{`Sektor: ${props.mission.sector}`}</Card.Title>
        <Card.Text>{props.mission.description}</Card.Text>
        {!props.dailyMission || props.dailyMission.completedByPlayer != null ? (
          <Button variant="primary" className="w-100" disabled>
            Mission abgeschlossen
          </Button>
        ) : (
          <Link to={`/MissionComplete/${props.dailyMission.id}`}>
            <Button variant="primary" className="w-100">
              Mission abschließen
            </Button>
          </Link>
        )}
      </Card.Body>
    </Card>
  );
}
