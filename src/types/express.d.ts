declare global {
    // extending the Request type globaly
    namespace Express {
        interface Request {
            user?: {
                userId: number
                name: string;
                iat: number;
                role: string;
            };

        }
    }
}
export {}; 