--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE chat (
		player INTEGER NOT NULL,
		team INTEGER NOT NULL,
		time DATE NOT NULL,
		message TEXT NOT NULL,
		FOREIGN KEY(team) REFERENCES teams(id),
		FOREIGN KEY(player) REFERENCES players(id)
);
CREATE INDEX chatByTeam ON chat (
		team,
		time DESC
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE chat;
