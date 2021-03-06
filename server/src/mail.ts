import config from "config";
import nodemailer from "nodemailer";
import { createPwRecoveryToken } from "./database/passwordRecovery";
import { createMailVerificationToken } from "./database/verify";

let transporter = nodemailer.createTransport({
	host: config.get<string>("mailHost"),
	port: Number(config.get<string>("mailPort")),
	tls: {
		ciphers: config.get<string>("mailCiphers"),
		rejectUnauthorized: false,
	},
	auth: {
		user: config.get<string>("mailUser"),
		pass: config.get<string>("mailPass"),
	},
});

export async function sendMail(
	receiver: string,
	subject: string,
	text: string
) {
	let mailOptions = {
		from: config.get<string>("mailUser"),
		to: receiver,
		subject: subject,
		text: text,
	};
	transporter.sendMail(mailOptions);
}

export async function contactMail(
	user: string,
	mail: string,
	subject: string,
	text: string
) {
	sendMail(
		config.get<string>("supportMail"),
		"" + subject,
		"Nachricht von " + user + " (" + mail + "): \n" + text
	);
}

export async function sendPwRecoveryMail(
	userId: number,
	username: string,
	mail: string
) {
	let link =
		"https://" +
		config.get<string>("domainName") +
		"/changePassword?token=" +
		createPwRecoveryToken(userId);
	sendMail(
		mail,
		"Passwortwiederherstellung",
		"Hallo " +
			username +
			",\nbitte klicke auf den folgenden Link um dein Passwort zu ändern:\n" +
			link +
			"\nAchtung, dieser Link ist nur 20 Minuten gültig.\nFalls du keine Passwortänderung angefordert hast, kannst du diese E-mail einfach ignorieren.\nMit freundlichen Grüßen\nDein Dis-positiv Team"
	);
}

export async function sendVerificationMail(
	userId: number,
	username: string,
	mail: string
) {
	let link =
		"https://" +
		config.get<string>("domainName") +
		"/verify?token=" +
		createMailVerificationToken(userId);
	sendMail(
		mail,
		"mission:future - E-mailadresse bestätigen",
		"Hallo " +
			username +
			",\nbitte klicke auf den folgenden Link um deine E-mailadresse zu bestätigen um deine Anmeldung abzuschließen:\n" +
			link +
			"\nMit freundlichen Grüßen\nDein Dis-positiv Team"
	);
}
