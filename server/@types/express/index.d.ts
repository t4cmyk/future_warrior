import { IUserData } from "../../src/authentication";

declare global {
	namespace Express {
		interface Request {
			currentUser: IUserData;
		}
	}
}
