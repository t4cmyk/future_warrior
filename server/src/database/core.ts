import openSqliteDB from "better-sqlite3";
import config from "config";
import { migrate } from "./migration";
import { join } from "path";

console.log("Loading database...");
export const database = openSqliteDB("server.db");
migrate(database);
