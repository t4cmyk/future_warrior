import { Request, Response } from "express";

export async function forgotPasswordHandler(req: Request, resp: Response) {
	try {
		//TODO

		resp.status(200).json({});
	} catch {
		resp.sendStatus(500);
	}
}