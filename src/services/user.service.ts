import { Repository } from "typeorm";
import { User } from "../models/user.model";
import { AppDataSource } from "../config/dbConfig";
import { IUser, UserDTO } from "../interfaces/user.INTF";
import { AppError } from "../utils/appError";

export class UserService {
    private readonly userRepo: Repository<User>
    constructor() {
        this.userRepo = AppDataSource.getRepository(User)
    }
    async getAllUsers() {
        let users: IUser[] | [] = await this.userRepo.find({ select: ["name", "email", "phone", "role"] })
        if (!users.length) throw new AppError("Out Of Users", 404)
        return users
    }
    async getUser(id: number) {
        let user: IUser | null = await this.userRepo.findOne({ where: { id }, select: ["name", "email", "phone", "role"] })
        if (!user) throw new AppError("User Not Found", 404)
        return user
    }
    async updateUser(userData: UserDTO) {
        let user = await this.getUser(userData.id)
        if (!user) throw new AppError("User Not Found", 404)

        Object.assign(user, userData)
        user = await this.userRepo.save(user)
        return user

    }

    async deleteUser(id: number) {
        let user = await this.getUser(id)
        await this.userRepo.delete(id)
    }
}