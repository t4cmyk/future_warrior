--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
	password TEXT NOT NULL,
	passwordSalt TEXT NOT NULL,
	plz TEXT NOT NULL,
	mail TEXT NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE players;
