--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
ALTER TABLE participates ADD sector TEXT;
--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
ALTER TABLE participates DROP COLUMN sector TEXT;