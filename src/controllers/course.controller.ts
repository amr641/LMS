import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { ICourse } from "../interfaces/course.INTF";
import { AppDataSource } from "../config/dbConfig";
import { Course } from "../models/course.model";
import { redisServices } from "../config/redisConfig";
let message = "success"
export class CourseController {
    private readonly courseServices: CourseService
    constructor() {
        this.courseServices = new CourseService(AppDataSource.getRepository(Course), redisServices)
    }
    async createCourse(req: Request, res: Response) {
        let course: ICourse = await this.courseServices.createCourse({
            instructor: Number(req.user?.id),
            category: Number(req.body.category),
            ...req.body
        })
        res.status(201).json({ message, course })
    }
    async getCourse(req: Request, res: Response) {
        let { id } = req.params
        let course: ICourse = await this.courseServices.getCourse(Number(id))
        res.status(200).json({ message, course })
    }
    async getAllCourses(req: Request, res: Response) {
        let { page, limit } = req.query
        let data = await this.courseServices.getAllCourses(Number(page), Number(limit))
        res.status(200).json({ message, data })
    }
    async getCategoryCourses(req: Request, res: Response) {
        let { page, limit } = req.query
        let { categoryId } = req.params;
        let courses = await this.courseServices.getCategoryCourses(Number(categoryId), Number(page), Number(limit));
        res.status(200).json({ message, courses })
    }
    async getCourseFromCategory(req: Request, res: Response) {
        let { categoryId, courseId } = req.params
        let categoryIdNum = Number(categoryId);
        let courseIdNum = Number(courseId);
        let course: ICourse = await this.courseServices.getSpecificCategoryCourse(categoryIdNum, courseIdNum)
        res.status(200).json({ message, course })
    }
    async deleteCourse(req: Request, res: Response) {
        let { id } = req.params
        await this.courseServices.deleteCourse(Number(id))
        res.status(200).json({ message: `Course With id :${id} deleted successfully` })

    }
    async updateCourse(req: Request, res: Response) {
        let { id } = req.params
        let course: ICourse = await this.courseServices.updateCourse({
            ...req.body
        }, Number(id))
        res.status(201).json({ message, course })
    }
}