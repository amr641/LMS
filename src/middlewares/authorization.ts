import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError"
import { Roles } from "../enums/roles.enum"
import { AppDataSource } from "../config/dbConfig"
import { Course } from "../models/course.model"
import { IUser } from "../interfaces/user.INTF"
import { UserService } from "../services/user.service"
import { Enrollment } from "../models/enrollment.model"
import { PaymentStatus } from "../enums/payment.status"
const courseRepo = AppDataSource.getRepository(Course);
const enrollmentRepo = AppDataSource.getRepository(Enrollment)
const userServices = new UserService();


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
  let user: IUser | null = await userServices.getUser(Number(id))
  if (!user) throw new AppError("user not found", 404)

  return user.role == Roles.ADMIN ? next(new AppError("You Are Not Authorized", 403)) : next()
}

const authorizeStudent = async (req: Request, res: Response, next: NextFunction) => {
  if(req.user?.role==Roles.ADMIN){
    return next()
  }
  let { courseId } = req.params
  let studentId = Number(req.user?.id)
  // only students who complete the Enrollment condtions can access the course material and assignments
  let enrollment = await enrollmentRepo.findOne({ where: { course: Number(courseId), student: studentId, paymentStatus: PaymentStatus.PAID } })
  if (!enrollment) throw new AppError("You Are Not Authorized", 401)
  next()
}
export {
  allowedTo,
  authorizeInstructor,
  restrictAdminActions,
  authorizeStudent
}