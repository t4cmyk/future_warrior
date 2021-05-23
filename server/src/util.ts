import config from "config";

const tokenSecret = config.get<string>("jwtSecret");

export function getAccessTokenSecret() {
	return tokenSecret;
}

export function convertJsToSQLDate(jsDate: Date) {
	let sqlDate =
		jsDate.getFullYear() +
		"-" +
		jsDate.getMonth() +
		"-" +
		jsDate.getDate() + // date != day
		" " +
		jsDate.getHours() +
		":" +
		jsDate.getMinutes() +
		":" +
		jsDate.getSeconds();
	return sqlDate;
}

export function convertSQLToJsDate(sqlDate: string) {
	const match = /(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/.exec(sqlDate);
	if (!match) throw new Error();
	// const match = result[0];
	const year = parseInt(match[1]);
	const month = parseInt(match[2]);
	const day = parseInt(match[3]);
	const hour = parseInt(match[4]);
	const min = parseInt(match[5]);
	const secs = parseInt(match[6]);
	const date = new Date(year, month, day, hour, min, secs);

	return date;
}

export function getStartOfDay(day: Date) {
	//04.00
	let result = new Date(day.getFullYear(), day.getMonth(), day.getDate());
	result.setTime(
		result.getTime() + 4 * 60 * 60 * 1000
	);
	return new Date(day.getFullYear(), day.getMonth(), day.getDate());
}

export function getEndOfDay(day: Date) {
	// 03:59:59
	let result = new Date(day.getFullYear(), day.getMonth(), day.getDate());
	result.setTime(
		result.getTime() + 3 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000
	);
	return result;
}
