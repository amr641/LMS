// import { Repository } from "typeorm";
// import { User } from "../../models/user.model";
// import { AppDataSource } from "../../config/dbConfig";
// import { AuthService } from "./auth.service";
// import passport from "passport";
// import { Strategy as FacebookStrategy } from "passport-facebook";

// class OAuthFacebookService {
//     private userRepo :Repository<User>
//     private authService :AuthService
//     constructor(){
//         this.initializeFacebookStrategy();
//         this.userRepo = AppDataSource.getRepository(User);
//                 this.authService = new AuthService()
//     }
//     private async initializeFacebookStrategy(){
//         passport.use(
//             new FacebookStrategy(
//                 {
//                   clientID: process.env.FACEBOOK_APP_ID, // Use environment variables for security
//                   clientSecret:
//                     process.env.FACEBOOK_APP_SECRET , // Avoid hard-coding secrets
//                   callbackURL: "http://localhost:3000/api/v1/auth/facebook/callback",
//                   profileFields: ["id", "displayName", "email"], // Fetch required fields
//                 },
//                 async function (accessToken, refreshToken, profile, done) {
                
//                 }
//               )
//             );
            
//         }
    
// }
