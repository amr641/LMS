import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

import { DecodedToken } from "../types/express";
import { Repository } from "typeorm";
import { User } from "../models/user.model";
import { AppDataSource } from "../config/dbConfig";



export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers?.token as string | undefined;
  let userRepo: Repository<User> = AppDataSource.getRepository(User)

  if (!token) {
    return next(new AppError('No token provided', 401));
  }


  const decoded = await new Promise<DecodedToken>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY || 'secret', (err, decoded) => {
      if (err?.name === 'TokenExpiredError') {
        throw new AppError('Token expired', 401)
      }
      if (err) {
        reject(new AppError('Invalid token', 401));
      }
      resolve(decoded as DecodedToken);
    });
  });

  const user = await userRepo.findOneBy({ id: decoded.userId })
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = decoded;
  next();

};