import config from "config";

var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	host: config.get<string>("mailHost"),
	port: config.get<string>("mailPort"),
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
	var mailOptions = {
		from: config.get<string>("mailUser"),
		to: receiver,
		subject: subject,
		text: text,
	};
	transporter.sendMail(mailOptions);
}
