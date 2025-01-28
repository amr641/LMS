import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    private authServices: AuthService;

    constructor() {
        this.authServices = new AuthService();
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
}