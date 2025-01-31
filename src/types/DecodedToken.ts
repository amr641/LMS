import { Roles } from "../enums/roles.enum";

export type DecodedToken = {
    id: number;
    name: string;
    iat: number;
    role: Roles;
    email:string;
    phone:number
};