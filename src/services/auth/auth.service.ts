import { Repository } from "typeorm"
import { AppDataSource } from "../../config/dbConfig"
import { IUser } from "../../interfaces/user.INTF"
import { User } from "../../models/user.model"
import { AppError } from "../../utils/appError"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Roles } from "../../enums/roles.enum"
import 'dotenv/config'
import { ResetPasswordDTO } from "../../types/auth.types"


export class AuthService {
    private readonly userRepo: Repository<User>
    
    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }


    async register(userData: IUser) {
        let user: User | null = await this.userRepo.findOneBy({ email: userData.email })
        if (user) throw new AppError("user already exist", 400)
        userData.password = await bcrypt.hash(userData.password, 10);
        user = this.userRepo.create(userData)
        await this.userRepo.save(user)
        return this.generateToken(user.id, user.email, user.phone, user.role)
    }

    async login(email: string, password: string) {
        let user: User | null = await this.userRepo.findOne({ where: { email: email } })
        if (!user) throw new AppError("incorrect email or password", 400)

        let matched = await new Promise<boolean>((resolve) => {
            setImmediate(async () => {
                const result = await bcrypt.compare(password, user.password);
                resolve(result);
            });
        });
        if (!matched) throw new AppError("incorrect email or password", 400)
        return this.generateToken(user.id, user.email, user.phone, user.role)

    }
    async resetPassword(resetData: ResetPasswordDTO) {
        // let user: IUser | null = await this.userRepo.findOne({ where: { id: resetData.userId } });

        // if (!user) throw new AppError("user not found", 404)
        // //to avoid blocking the main thread
        // const matched = await bcrypt.compare(resetData.oldPassword, user.password);
        // if (!matched) throw new AppError("incorrect old password", 401)
        // const [newPassword, token] = await Promise.all([
        //     await bcrypt.hash(resetData.newPassword, 10),
        //     this.generateToken(user.id, user.email, user.phone, user.role)
        // ])

        // await this.userRepo.update(user.id, { password: newPassword })
        // return token
        let user: IUser | null = await this.userRepo.findOne({ where: { id: resetData.userId } });

        if (!user) throw new AppError("user not found", 404)
        const matched = await new Promise<boolean>((resolve) => { //to avoid blocking the main thread
            setImmediate(async () => {
                const result = await bcrypt.compare(resetData.oldPassword, user.password);
                resolve(result);
            });
        });

        if (!matched) throw new AppError("incorrect old password", 401)
        let newPassword = await bcrypt.hash(resetData.newPassword, 10)
        await this.userRepo.update(user.id, { password: newPassword })
        return this.generateToken(user.id, user.email, user.phone, user.role)

    }


    public generateToken(id: number, email: string, phone: number, role: Roles) {
        return jwt.sign({
            id, email, role, phone
        }, process.env.JWT_KEY as string, { expiresIn: "1h" })
    }

}