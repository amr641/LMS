import { Roles } from "../enums/roles.enum";

export interface IUser {
    id: number; 
    name: string; 
    email: string; 
    password: string; 
    role: Roles; 
    DOB: Date; 
    phone:number;
    createdAt: Date; 
    updatedAt: Date; 
    
  }