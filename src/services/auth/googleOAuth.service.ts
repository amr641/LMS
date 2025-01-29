import { Repository } from "typeorm";
import { AppDataSource } from "../../config/dbConfig";
import { User } from "../../models/user.model";
import { AppError } from "../../utils/appError";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "./auth.service";
import { IUser } from "../../interfaces/user.INTF";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../enums/roles.enum";
import { DecodedToken } from "../../types/express";


export class OAuthService {
    private userRepo: Repository<User>
    private authService: AuthService
    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
        this.initializeGoogleStrategy();
        this.authService = new AuthService()
    }
    private async initializeGoogleStrategy() { // google strategy initialization 
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID as string,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                    callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
                },
                (accessToken, refreshToken, profile: any, done) => {
                    const email = profile.emails?.[0]?.value;
                    const phoneNumber = profile.phoneNumbers?.[0]?.value;
                    if (!email) return done(new AppError("Email not found", 400));


                    const token = this.authService.generateToken(Number(profile.id), email, phoneNumber, Roles.STUDENT);

                    this.verifyTokenForOAuth(token)
                    return done(null, token);
                }
            )
        );
    }
    async loginWithGoogle(req: Request, res: Response): Promise<string> { // handel the callback and send the token
        return new Promise<string>((resolve, reject) => {
            passport.authenticate("google", { session: false }, (err: any, token: string) => {
                if (err || !token) {
                    return reject(new AppError("Authentication failed", 400));
                };
                resolve(token);

            })(req, res);
        });
    }
    private async verifyTokenForOAuth(token: string) { // this function job is just decode the token and check if user exist or not>save em in database 
        let decode: DecodedToken = jwtDecode(token)
        if (decode) {
            let user: IUser | null = await this.userRepo.findOneBy({ email: decode.email });

            if (!user) {
                user = this.userRepo.create({
                    name: decode.email,
                    email: decode.email,
                    phone: Number(decode.phone)

                })
               await this.userRepo.save(user)
            }
        }
    }

}