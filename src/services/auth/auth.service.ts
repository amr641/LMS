import { Repository } from "typeorm"
import { AppDataSource } from "../../config/dbConfig"
import { IUser } from "../../interfaces/user.INTF"
import { User } from "../../models/user.model"
import { AppError } from "../../utils/appError"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Roles } from "../../enums/roles.enum"
import 'dotenv/config'





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
        return this.generateToken(user.id, user.email, user.phone, user.role)
    }

    async login(email: string, password: string) {
        let user: User | null = await this.userRepo.findOneBy({ email: email })
        if (!user) throw new AppError("incorrect email or password", 400)

        let matched = await bcrypt.compare(password, user.password).then(result => result ? true : false) // no need to catch
        if (!matched) throw new AppError("incorrect email or password", 400)
        return this.generateToken(user.id, user.email, user.phone, user.role)

    }
   

    public generateToken(id: number, email: string, phone: number, role: Roles) {
        return jwt.sign({
            id, email, role, phone
        }, process.env.JWT_KEY as string, { expiresIn: "1h" })
    }
   
}