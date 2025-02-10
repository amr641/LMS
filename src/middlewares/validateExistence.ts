import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/dbConfig";
import { Category } from "../models/category.model";
import { AppError } from "../utils/appError";
import { AssignmentServices } from "../services/assignment.service";
import { Submission } from "../models/submission.model";
import { Assignment } from "../models/assignments.model";
import { Payment } from "../models/payment.model";
import { CourseService } from "../services/course.service";
const courseServices = new CourseService()
const SubmissionRepo = AppDataSource.getRepository(Submission);
const assignmentRepo = AppDataSource.getRepository(Assignment)
const validateCategoryExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const categoryId = Number(req.params.categoryId);

    const category = await AppDataSource.getRepository(Category).findOneBy({ id: categoryId || req.body.category });
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    next();
};

const isSubmissionAllowed = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { assignment } = req.body


    let isAssignmentExist = await assignmentRepo.findOne({ where: { id: Number(assignment) } })

    if (!isAssignmentExist) throw new AppError("Assignment Does Not Found", 404);
    let submission = await SubmissionRepo.findOne({ where: { assignment: Number(assignment), student: Number(req.user?.id) } })
    if (submission) throw new AppError("Assignment Already Submitted", 401)
    req.params.courseId = String(isAssignmentExist.course)
    next()
}

const isUserPaid = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let user = Number(req.user?.id);
    let courseId = Number(req.body.course)
    let course = await courseServices.getCourse(courseId)
    let payment = await AppDataSource.getRepository(Payment).createQueryBuilder("payment")
        .where("payment.user = :user", { user })
        .andWhere("payment.description = :description", { description: course.title })
        .getOne();
    if (!payment) throw new AppError("You Have To Pay First", 401)
    next()
}


export {
    validateCategoryExists,
    isSubmissionAllowed,
    isUserPaid
}