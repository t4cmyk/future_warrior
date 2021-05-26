import React, { useEffect, useState } from "react";
import { getToken } from "../../core/authentication";
import { Carousel } from "../carousel";
import { MissionCard } from "../missionCard";

export interface IDailyMissionData {
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
      height={800}
      width={338}
      timeConstant={250}
      render={(elem) => (
        <MissionCard missionsId={elem.mission} dailyMission={elem} />
      )}
      onContextMenu={() => {}}
      onDoubleClick={() => {}}
      elementList={props.missions}
    ></Carousel>
  );
}

export function Missions() {
  const [isDailyMissionRemaning, setIsDailyMissionRemaning] =
    useState<boolean>(false);
  const [missions, setMissions] = useState<IDailyMissionData[]>([]);
  useEffect(() => {
    const remainingMissioHandler = { onFetch: setIsDailyMissionRemaning };
    const fetchRemainingMissionInfo = async () => {
      try {
        const resp = await fetch(`/checkRemainingMissions?token=${getToken()}`);
        const respData = (await resp.json()) as boolean;
        setIsDailyMissionRemaning(respData);
        return respData;
      } catch (e) {
        console.log(e);
      }
      return;
    };
    fetchRemainingMissionInfo().then((result) =>
      remainingMissioHandler.onFetch(result)
    );

    const resultHandler = { onFetch: setMissions };
    const fetchMissions = async () => {
      try {
        const resp = await fetch(`/dailyMissions?token=${getToken()}`);
        const respData = (await resp.json()) as IDailyMissionData[];
        respData.forEach((dailyMission) =>
          sessionStorage.setItem(
            `daily/${dailyMission.id}`,
            JSON.stringify(dailyMission)
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
      {isDailyMissionRemaning?(
      <ControlledCarousel missions={missions} />) : (<>
      <h2>
        Gratulation! Du hast heute die maximale Anzahl an Missionen
        abgeschlossen. Morgen kannst du neue abschließen.
      </h2>
      <div className="disabled">
        <ControlledCarousel missions={missions} />
      </div></>
      )}
    </>
  );
}
