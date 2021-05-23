import React, { useEffect, useState } from "react";
import { getToken } from "../../core/authentication";
import { Carousel } from "../carousel";
import { MissionCard } from "../missionCard";

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
        const resp = await fetch(`/dailyMissions?token=${getToken()}`);
        const respData = (await resp.json()) as IDailyMissionData[];
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
