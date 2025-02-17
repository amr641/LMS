import { Repository } from "typeorm";
import { Course } from "../models/course.model";
import { AppDataSource } from "../config/dbConfig";
import { CourseDTO, ICourse } from "../interfaces/course.INTF";
import { AppError } from "../utils/appError";


export class CourseService {
    private readonly courseRepo: Repository<Course>
    constructor() {
        this.courseRepo = AppDataSource.getRepository(Course)
    }

    async createCourse(courseData: CourseDTO) {
        let course: ICourse = this.courseRepo.create(courseData)
        course = await this.courseRepo.save(course)
        return course

    }
    async getAllCourses(page: number, limit: number) {
        const [courses, total] = await this.courseRepo.findAndCount({
            take: limit || 0,
            skip: (page - 1) * limit || 0,
        });
        if (!courses.length) throw new AppError("No Courses avilable", 404)
        return {
            data: courses,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    }
    async getCourse(id: number) {
        let course: ICourse | null = await this.courseRepo.findOne({ where: { id } })
        if (!course) throw new AppError("course not found", 404)
        return course
    }
    async updateCourse(courseData: CourseDTO, id: number) {
        let course: ICourse | null = await this.getCourse(id)
        Object.assign(course, courseData)
        course = await this.courseRepo.save(course)
        return course
    }

    async deleteCourse(id: number) {
        let course: ICourse | null = await this.getCourse(id)

        await this.courseRepo.delete(course.id)

    }

    async getCategoryCourses(categoryId: number, page: number, limit: number) {
        const courses = await this.courseRepo
            .createQueryBuilder("course")
            .innerJoinAndSelect("course.category", "category")
            .where("category.id = :categoryId", { categoryId })
            .skip((page - 1) * limit || 0) // Offset calculation
            .take(limit || 0) // Limit per page
            .getManyAndCount();
        if (!courses.length) throw new AppError("No Courses avilable", 404)
        return courses
    }
    async getSpecificCategoryCourse(categoryId: number, courseId: number) {
        let course: ICourse | null = await this.courseRepo.findOne(
            {
                where: {
                    category: categoryId,
                    id: courseId
                }
            }
        )
        if (!course) throw new AppError("course not found", 404)
        return course
    }

}