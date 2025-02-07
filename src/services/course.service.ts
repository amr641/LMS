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
    async getAllCourses() {
        let courses: ICourse[] | [] = await this.courseRepo.find()
        if (!courses.length) throw new AppError("No Courses avilable", 404)
        return courses
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

    async getCategoryCourses(categoryId: number) {
        let courses: ICourse[] = await this.courseRepo.find({ where: { category: categoryId } })
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