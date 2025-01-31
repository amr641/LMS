import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import passport from "passport";
import { verifyToken } from "../middlewares/verifiyToken";


export const authRouter = Router()
const authController = new AuthController()

//auth onsite
authRouter.post("/register", authController.register.bind(authController))
authRouter.post("/login", authController.login.bind(authController))
authRouter.use(verifyToken)
authRouter.post("/reset-password", authController.resetPassword.bind(authController))
// OAuth
authRouter.use(passport.initialize());
authRouter.get("/auth/google", passport.authenticate("google", {
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/contacts.readonly"
  ]
}));
authRouter.get("/auth/google/callback", authController.loginWithGoogle.bind(authController))