
    // extending the Request type globaly
    declare module 'express-serve-static-core' {
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


export  {  }; 