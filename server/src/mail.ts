import config from "config";
import nodemailer from "nodemailer";

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

export async function sendPwRecoveryMail(user: string,mail: string) {
	let link = "https://"+config.get<string>("domainName") +"/changePassword"+":todo";
	sendMail(
		mail,
		"Passwortwiederherstellung",
		"Hallo " +
			user +
			",\n bitte klicke auf den folgenden Link um dein Passwort zu ändern:\n" +
			link +
			"\n \nFalls du keine Passwortänderung angefordert hast, kannst du diese E-mail einfach ignorieren.\n Mit freundlichen Grüßen\nDein Dis-positiv Team"
	);
}
