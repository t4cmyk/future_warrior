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
