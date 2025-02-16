import { Request, Response } from "express";
import { OAuthGoogleService } from "../../services/auth/googleOAuth.service";
import { AuthService } from "../../services/auth/auth.service";
import { AppDataSource } from "../../config/dbConfig";
import { User } from "../../models/user.model";

export class AuthController {
    private authServices: AuthService;
    private googleAuth: OAuthGoogleService

    constructor() {
        this.authServices = new AuthService(AppDataSource.getRepository(User));
        this.googleAuth = new OAuthGoogleService()
    }

    async register(req: Request, res: Response) { // register on site
        let token = await this.authServices.register(req.body)
        res.status(201).json({ message: "success", token })
    }
    async login(req: Request, res: Response) { //login onsite
        let { email, password } = req.body
        let token = await this.authServices.login(email, password)
        res.status(201).json({ message: "success", token })

    }
    async loginWithGoogle(req: Request, res: Response) { // login/register if user does not exist
        let token = await this.googleAuth.loginWithGoogle(req, res)
        res.status(200).json({ message: "success", token })
    }
    async resetPassword(req: Request, res: Response) { // reset password
        let { oldPassword, newPassword } = req.body
        let token = await this.authServices.resetPassword({
            userId: req.user?.id!,
            oldPassword,
            newPassword,
        })
        res.status(201).json({ message: "success", token })
    }
}