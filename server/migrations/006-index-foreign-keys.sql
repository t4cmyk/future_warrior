--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
DROP TABLE dailyMissions;
CREATE TABLE dailyMissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission INTEGER NOT NULL,
    team INTEGER NOT NULL,
    completedByPlayer INTEGER,
    FOREIGN KEY(mission) REFERENCES missions(id),
    FOREIGN KEY(team) REFERENCES teams(id),
    FOREIGN KEY(completedByPlayer) REFERENCES players(id)
);
DROP TABLE feedback;
CREATE TABLE feedback (
    missionId INTEGER NOT NULL,
		playerId INTEGER NOT NULL,
		time DATE NOT NULL,
		feedback TEXT NOT NULL,
		enjoy INTEGER NOT NULL,
		importance INTEGER NOT NULL,
		frequency INTEGER NOT NULL,
		comments TEXT NOT NULL,
    FOREIGN KEY(missionId) REFERENCES missions(id),
    FOREIGN KEY(playerId) REFERENCES players(id)
);
DROP TABLE participates;
CREATE TABLE participates (
  gameId INTEGER NOT NULL,
  teamId INTEGER NOT NULL,
  playerId INTEGER NOT NULL,
  score INTEGER NOT NULL,
  FOREIGN KEY(gameId) REFERENCES games(id),
  FOREIGN KEY(teamId) REFERENCES teams(id),
  FOREIGN KEY(playerId) REFERENCES players(id)
);
CREATE INDEX latestFeedback ON feedback (
	"time"	DESC
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP INDEX latestFeedback;
DROP TABLE dailyMissions;
CREATE TABLE dailyMissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission INTEGER NOT NULL,
    team INTEGER NOT NULL,
    completedByPlayer INTEGER
);
DROP TABLE feedback;
CREATE TABLE feedback (
    missionId INTEGER NOT NULL,
		playerId INTEGER NOT NULL,
		time DATE NOT NULL,
		feedback TEXT NOT NULL,
		enjoy INTEGER NOT NULL,
		importance INTEGER NOT NULL,
		frequency INTEGER NOT NULL,
		comments TEXT NOT NULL
);
DROP TABLE participates;
CREATE TABLE participates (
  gameId INTEGER NOT NULL,
  teamId INTEGER NOT NULL,
  playerId INTEGER NOT NULL,
  score INTEGER NOT NULL
);
