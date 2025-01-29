import { Request, Response } from "express";
import { OAuthService } from "../services/auth/googleOAuth.service";
import { AuthService } from "../services/auth/auth.service";

export class AuthController {
    private authServices: AuthService;
    private googleAuth: OAuthService

    constructor() {
        this.authServices = new AuthService();
        this.googleAuth = new OAuthService()
    }
    async register(req: Request, res: Response) {
        let token = await this.authServices.register(req.body)
        res.status(201).json({ message: "success", token })
    }
    async login(req: Request, res: Response) {
        let { email, password } = req.body
        let token = await this.authServices.login(email, password)
        res.status(201).json({ message: "success", token })

    }
    async loginWithGoogle(req: Request, res: Response) {
        let token = await this.googleAuth.loginWithGoogle(req, res)
        res.status(200).json({ message: "success", token })
    }
}