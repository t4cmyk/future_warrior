--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
DROP TABLE dailyMissions;
CREATE TABLE dailyMissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission INTEGER NOT NULL,
    team INTEGER NOT NULL,
    completedByPlayer INTEGER
);

DROP TABLE teams;
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sector1 TEXT,
  sector2 TEXT,
  lastDailyUpdate DATE
);


--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE teams;
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sector1 TEXT,
  sector2 TEXT 
);

DROP TABLE dailyMissions;
CREATE TABLE dailyMissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    missionId INTEGER NOT NULL,
    teamId INTEGER NOT NULL,
    playerId INTEGER
);
