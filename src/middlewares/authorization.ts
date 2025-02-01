import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"
import { Roles } from "../enums/roles.enum"
import { ICourse } from "../interfaces/course.INTF"
import { AppDataSource } from "../config/dbConfig"
import { Course } from "../models/course.model"
const courseRepo = AppDataSource.getRepository(Course);


const allowedTo = function (...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string))
      throw new AppError('you are not authorized', 401)
    next()

  }
}

type instructorId= {instructor:number}

const authorzeInstructor = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role == Roles.ADMIN) {
    return next()
  }
  let { id } = req.params
  let course :instructorId|undefined = await courseRepo.createQueryBuilder("course")
  .select('course.instructorId',"instructor" )
  .where({id:Number(id)})
  .getRawOne() ;

  if (!course) throw new AppError("course not found", 404)
  return course.instructor == req.user?.id ? next() : next(new AppError("you are not authorized", 403))
}
export { allowedTo, authorzeInstructor }