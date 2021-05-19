import { Request, Response } from "express";
import { verifyMailVerificationToken, verifyUser } from "../database/verify";

export async function verifyHandler(req: Request, resp: Response) {
	try {
		const token = req.body.token;
		let tokenContent = verifyMailVerificationToken(token);
		if (tokenContent != undefined) verifyUser(tokenContent.id);
		else throw new Error();

		//resp.status(200).json({});

		resp.sendStatus(200);
	} catch {
		resp.sendStatus(500);
	}
}
