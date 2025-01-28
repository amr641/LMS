import { Repository } from "typeorm"
import DBconnection, { AppDataSource } from "../config/dbConfig"
import { IUser } from "../interfaces/user.INTF"
import { User } from "../models/user.model"
import { AppError } from "../utils/appError"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Roles } from "../enums/roles.enum"



export class AuthService {
    private userRepo: Repository<User>
    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }
    async register(userData: IUser) {

        let user: User | null = await this.userRepo.findOneBy({ email: userData.email })
        if (user) throw new AppError("user already exist", 400)
        userData.password = await bcrypt.hash(userData.password, 10);
        user = this.userRepo.create(userData)
        await this.userRepo.save(user)
        return this.generateToken(user.id, user.email, user.role)
    }
    private generateToken(id: number, email: string, role: Roles) {
        return jwt.sign({
            id, email, role
        }, "zxc", { expiresIn: "1h" })
    }
}