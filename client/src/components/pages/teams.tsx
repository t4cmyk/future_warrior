import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  //sample Data
  {
    name: "01.05",
    team1: 0,
    team2: 0,
    amt: 100,
  },
  {
    name: "02.05",
    team1: 14,
    team2: 10,
    amt: 100,
  },
  {
    name: "03.05",
    team1: 20,
    team2: 20,
    amt: 100,
  },
];

export function Teams() {
  return (
    <>
      <h1>Teams</h1>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="linear"
          dataKey="team1"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="linear" dataKey="team2" stroke="#82ca9d" />
      </LineChart>
    </>
  );
}
