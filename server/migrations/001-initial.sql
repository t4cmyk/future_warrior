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

CREATE TABLE missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
	description TEXT NOT NULL,
	imagePath TEXT NOT NULL,
	score INTEGER NOT NULL,
	sector TEXT NOT NULL,
	advanced BOOL NOT NULL,
	custom BOOL NOT NULL,
	creator INTEGER NOT NULL 
);

CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sector1 TEXT,
  sector2 TEXT 
);

CREATE TABLE games (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	start DATE NOT NULL,
	ending DATE NOT NULL
);

CREATE TABLE participates (
  gameId INTEGER NOT NULL,
  teamId INTEGER NOT NULL,
  playerId INTEGER NOT NULL,
  score INTEGER NOT NULL
);



--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE players;
DROP TABLE missions;
DROP TABLE teams;
DROP TABLE games;
DROP TABLE participates;
