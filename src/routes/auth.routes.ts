import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

export const authRouter =Router()
const authController = new AuthController()
authRouter.post("/register", authController.register.bind(authController))