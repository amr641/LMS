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
}