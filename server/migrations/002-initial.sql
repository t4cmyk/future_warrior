--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
	description TEXT NOT NULL,
	score INTEGER NOT NULL,
	sector TEXT NOT NULL,
	creatorId INTEGER NOT NULL 
);


--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE missions;
