import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getToken } from "../../core/authentication";
import { Carousel } from "../carousel";
import { IMission, MissionCard } from "../missionCard";

interface IDailyMissionData {
  id: number;
  mission: number;
  completedByPlayer: number | null;
}

function ControlledCarousel(props: { missions: IDailyMissionData[] }) {
  return (
    <Carousel<IDailyMissionData>
      angle={-60}
      dist={-150}
      shift={10}
      height={520}
      width={288}
      timeConstant={250}
      render={(elem) => <MissionCard missionsId={elem.mission} />}
      onContextMenu={() => {}}
      onDoubleClick={() => {}}
      elementList={props.missions}
    ></Carousel>
  );
}

export function Missions() {
  const [missions, setMissions] = useState<IDailyMissionData[]>([]);
  useEffect(() => {
    const resultHandler = { onFetch: setMissions };
    const fetchMissions = async () => {
      try {
        const resp = await fetch(`/missions?token=${getToken()}`);
        const respData = (await resp.json()) as IDailyMissionData[];
        respData.forEach((mission) =>
          sessionStorage.setItem(
            `mission/${mission.id}`,
            JSON.stringify(mission)
          )
        );
        return respData;
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
