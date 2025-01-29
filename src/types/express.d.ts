import { Roles } from "../enums/roles.enum";

declare global {
    // extending the Request type globaly
    namespace Express {
        interface Request {
            user?: {
                userId: number
                name: string;
                iat: number;
                role: string;
            };

        }
    }
}
export type DecodedToken = {
    userId: number;
    name: string;
    iat: number;
    role: Roles;
    email:string;
    phone:number
};
export { }; 