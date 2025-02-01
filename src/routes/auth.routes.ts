import { Router } from "express";

import passport from "passport";
import { verifyToken } from "../middlewares/verifiyToken";
import { AuthController } from "../controllers/auth/auth.controller";


export const authRouter = Router()
const authController = new AuthController()

//auth onsite
authRouter
  .post("/register", authController.register.bind(authController))
  .post("/login", authController.login.bind(authController))

  .post("/reset-password", verifyToken, authController.resetPassword.bind(authController))
  // OAuth
  .use(passport.initialize())
  .get("/auth/google", passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/contacts.readonly"
    ]
  }))
  .get("/auth/google/callback", authController.loginWithGoogle.bind(authController))