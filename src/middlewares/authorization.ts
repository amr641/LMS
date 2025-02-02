import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"
import { Roles } from "../enums/roles.enum"
import { ICourse } from "../interfaces/course.INTF"
import { AppDataSource } from "../config/dbConfig"
import { Course } from "../models/course.model"
import { User } from "../models/user.model"
import { IUser } from "../interfaces/user.INTF"
const courseRepo = AppDataSource.getRepository(Course);
const userRepo = AppDataSource.getRepository(User)

const allowedTo = function (...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string))
      throw new AppError('you are not authorized', 401)
    next()

  }
}

type instructorId = { instructor: number }

const authorizeInstructor = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role == Roles.ADMIN) {
    return next()
  }
  let { id } = req.params
  let course: instructorId | undefined = await courseRepo.createQueryBuilder("course")
    .select('course.instructorId', "instructor")
    .where({ id: Number(id) })
    .getRawOne();

  if (!course) throw new AppError("course not found", 404)
  return course.instructor == req.user?.id ? next() : next(new AppError("you are not authorized", 403))
}


const restrictAdminActions = async (req: Request, res: Response, next: NextFunction) => {
  let { id } = req.params
  let user: IUser | null = await userRepo.findOne({ where: { id: Number(id) } })
  if (!user) throw new AppError("user not found", 404)

  return user.role == Roles.ADMIN ? next(new AppError("You Are Not Authorized", 403)) : next()
}
export { allowedTo, authorizeInstructor, restrictAdminActions }