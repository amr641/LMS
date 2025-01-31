
declare global {
    // extending the Request type globaly
    namespace Express {
        interface Request {
            user?: {
                id: number;
                name: string;
                iat: number;
                role: Roles;
                email:string;
                phone:number
            };

        }
    }
}

export  {  }; 