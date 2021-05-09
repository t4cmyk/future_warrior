--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE feedback;
