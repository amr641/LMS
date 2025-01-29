import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";


export const authRouter = Router()
const authController = new AuthController()
authRouter.post("/register", authController.register.bind(authController))
authRouter.use(passport.initialize());
authRouter.post("/login", authController.login.bind(authController))
authRouter.get("/auth/google", passport.authenticate("google", {
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/contacts.readonly"
  ]
}));
authRouter.get("/auth/google/callback", authController.loginWithGoogle.bind(authController))