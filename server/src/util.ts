import config from "config";

const tokenSecret = config.get<string>("jwtSecret");

export function getAccessTokenSecret() {
	return tokenSecret;
}

export function convertJsToSQLDate(jsDate: Date) {
	return jsDate
		.toISOString()
		.replace("T", " ")
		.replace(/\.\d\d\dZ/, "");
}

export function convertSQLToJsDate(sqlDate: string) {
	const match = /(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/.exec(sqlDate);
	if (!match) throw new Error();
	// const match = result[0];
	const year = parseInt(match[1]);
	const month = parseInt(match[2])-1;
	const day = parseInt(match[3]);
	const hour = parseInt(match[4]);
	const min = parseInt(match[5]);
	const secs = parseInt(match[6]);
	const timestamp = Date.UTC(year, month, day, hour, min, secs);
	const date = new Date(timestamp);

	return date;
}

export function getStartOfDay(day: Date) {
	//04.00
	const isBefore4AM = day.getHours() < 4;
	let result = new Date(
		day.getFullYear(),
		day.getMonth(),
		day.getDate() + (isBefore4AM ? -1 : 0)
	);
	result.setTime(result.getTime() + 4 * 60 * 60 * 1000);
	return result;
}

export function getEndOfDay(day: Date) {
	// 03:59:59
	const isBefore4AM = day.getHours() < 4;
	let result = new Date(
		day.getFullYear(),
		day.getMonth(),
		day.getDate() + (isBefore4AM ? 0 : 1)
	);
	result.setTime(
		result.getTime() + 3 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000
	);
	return result;
}

export function* daysBetween(start: Date, end: Date) {
	if (start > end) {
		let tmp = start;
		start = end;
		end = tmp;
	}
	let current = start;
	do {
		yield current;
		current.setDate(current.getDate() - 1);
	} while (current > end);
}
