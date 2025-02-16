import { Roles } from "../enums/roles.enum";

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Roles;
  DOB?: Date;
  phone: number;
  createdAt?: Date;
  updatedAt?: Date;

}
interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Roles;
  DOB: Date;
  phone: number;
}
interface MockUsers {

  name: string;
  email: string;
  role: Roles;
  phone: number;
}

export { IUser, UserDTO, MockUsers }