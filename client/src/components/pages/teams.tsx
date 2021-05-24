import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RecentFeedback } from "../missionFeedback";

interface TeamData {
  team: number;
  scores: number[];
}

function useServerStats() {
  const [stats, setStats] = useState<any[]>([]);
  useEffect(() => {
    const presistent = { cleanUp: false };
    fetch("/stats")
      .then((resp) => resp.json())
      .then((data) => {
        if (!presistent.cleanUp) {
          setStats(data);
        }
      });
    return () => (presistent.cleanUp = true);
  }, []);
  return stats;
}

export function Teams() {
  const stats = useServerStats();
  let lines: JSX.Element[] = [];
  if (stats.length > 0) {
    Object.keys(stats[0]).forEach((key, idx) => {
      if (key === "date") return;
      lines.push(
        <Line type="linear" key={idx} dataKey={key} stroke="#82ca9d" />
      );
    });
  }

  return (
    <>
      <h1>Teams</h1>
      <LineChart
        width={500}
        height={300}
        data={stats}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines}
      </LineChart>
      <RecentFeedback />
    </>
  );
}
