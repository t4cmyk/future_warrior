// https://github.com/JoshuaWise/better-sqlite3/issues/262#issuecomment-746443415

import fs from "fs";
import { Database } from "better-sqlite3";
import { join } from "path";

type Migration = NonNullable<ReturnType<typeof parseMigrationFile>>;
type MigrateParams = Partial<ReturnType<typeof getDefaultParams>>;

/**
 * Returns a parsed migration file if the file corresponds to the filename
 * schema of xxx.yyyyy.sql, where `x` is a number, and `y` anything.
 * @param root root directory
 * @param filename potential sql file
 */
const parseMigrationFile = (root: string, filename: string) => {
	const [, id, name] = filename.match(/^(\d+).(.*?)\.sql$/) || [
		null,
		null,
		null,
	];
	if (!name) {
		return null;
	}
	const [up, down] = fs
		.readFileSync(join(root, filename), "utf8")
		.split(/^--\s+?down\b/im)
		.map((part) => part.replace(/^--.*?$/gm, "").trim());
	return { id: Number(id), name, up, down };
};

/**
 * Loops through files in a directory and extracts the migration SQL files
 * @param migrations_directory a directory containing SQL files
 */
const readMigrations = (migrations_directory: string) =>
	fs
		.readdirSync(migrations_directory)
		.reduce((acc, file) => {
			const props = parseMigrationFile(migrations_directory, file);
			return props ? [...acc, props] : acc;
		}, [] as NonNullable<ReturnType<typeof parseMigrationFile>>[])
		.sort((a, b) => a.id - b.id);

/**
 * Create a database table for migrations meta data if it doesn't exist
 * @param db the database connection
 * @param table the table name
 */
const createMigrationsTable = (db: Database, table: string) => {
	db.transaction(() => {
		db.prepare(
			`CREATE TABLE IF NOT EXISTS "${table}" (
        id   INTEGER PRIMARY KEY,
        name TEXT    NOT NULL,
        up   TEXT    NOT NULL,
        down TEXT    NOT NULL
      )`
		).run();
	})();
};

/**
 * Reads the migrations metatable to see if it is valid.
 * Undoes migrations that exist only in the database but not in files.
 * Starts with the latest migration and climbs up. Assumes files are
 * sequential, so if it only removes superfluous migrations, leaving the
 * rest as they are
 * @param db database connection
 * @param table table name
 * @param is_valid a function that determines if a migration is valid. If it is,
 *                 then the database is now in sync, and the function ends
 */
const syncDatabaseMigrations = (
	db: Database,
	table: string,
	is_valid: (id: number) => boolean
) => {
	// Get the list of already applied migrations
	let dbMigrations: Migration[] = db
		.prepare(`SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`)
		.all();

	const remove_dbMigration = (id: number) =>
		(dbMigrations = dbMigrations.filter((migration) => migration.id !== id));

	const remove_migration = db.prepare(`DELETE FROM "${table}" WHERE id = ?`);
	const reversedDbMigrations = dbMigrations.slice().reverse();
	for (const { id, down } of reversedDbMigrations) {
		if (is_valid(id)) {
			break;
		}
		db.transaction(() => {
			db.exec(down);
			remove_migration.run(id);
			remove_dbMigration(id);
		})();
	}

	const lastMigrationId = dbMigrations.length
		? dbMigrations[dbMigrations.length - 1].id
		: 0;
	return lastMigrationId;
};

/**
 * Returns default parameters for the migrate function
 */
const getDefaultParams = () => ({
	table: "_meta_migrations",
	migrationsDirectory: "migrations",
	reapplyLast: true,
});

/**
 *
 * @param db a database connection
 * @param config optional configuration to specify migrations directory and/or
 *               metadata migration table name
 */
export const migrate = (db: Database, config: MigrateParams = {}) => {
	const { table, migrationsDirectory, reapplyLast } = {
		...getDefaultParams(),
		...config,
	};

	const migrations = readMigrations(migrationsDirectory);
	const lastFileMigrationId = migrations[migrations.length - 1].id;

	const migration_exists = (id: number) => {
		return (
			migrations.some((m) => m.id === id) &&
			(!reapplyLast || id !== lastFileMigrationId)
		);
	};

	createMigrationsTable(db, table);
	const lastDbMigrationId = syncDatabaseMigrations(db, table, migration_exists);

	// Apply pending migrations
	const add_migration = db.prepare(
		`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`
	);
	for (const { id, name, up, down } of migrations) {
		if (id > lastDbMigrationId) {
			db.transaction(() => {
				db.exec(up);
				add_migration.run(id, name, up, down);
			})();
		}
	}
};
