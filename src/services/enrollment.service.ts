import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import { EnrollmentDTO, IEnrollment } from "../interfaces/enrollment.INTF";
import { CourseService } from "./course.service";
import { AppError } from "../utils/appError";
import { Enrollment } from "../models/enrollment.model";
import Redis from "ioredis";
import { Course } from "../models/course.model";
export class EnrollmentServices {


    constructor(private readonly enrollementRepo: Repository<Enrollment>,
        private courseServices: CourseService,
        private readonly redisServices: Redis) {


    }

    async createEnrollment(enrollmentData: EnrollmentDTO) {
        let course = await this.courseServices.getCourse(enrollmentData.courseId)

        let enrollment = this.enrollementRepo.create({
            course: course.id,
            courseTitle: course.title,
            coursePrice: course.price,
            enrollmentDate: enrollmentData.enrollmentDate,
            student: enrollmentData.student,

        })
        await this.enrollementRepo.save(enrollment)

        return enrollment

    }
    async getEnrollment(id: number) {
        let enrollment: IEnrollment | null = await this.enrollementRepo.findOne({ where: { id } })
        if (!enrollment) throw new AppError("enrollment not found", 404)

        return enrollment
    }
    async getAllEnrollments() {
        const cachedKey = "enrollments"
        let cachedData = await this.redisServices.getex(cachedKey)
        if (cachedData) {
            return JSON.parse(cachedData); // if found respond with cached data
        }

        let enrollments: IEnrollment[] | [] = await this.enrollementRepo.find()
        if (!enrollments.length) throw new AppError("Out Of Enrollments", 404)
        await this.redisServices.setex(cachedKey, 10, JSON.stringify(enrollments))
        return enrollments
    }
    async updateEnrollment(enrollmentData: EnrollmentDTO, id: number) {
        let enrollment = await this.getEnrollment(id)
        Object.assign(enrollment, enrollmentData)
        enrollment = await this.enrollementRepo.save(enrollment)
        return enrollment

    }
    async deleteEnrollment(id: number) {
        let enrollment = await this.getEnrollment(id)
        await this.enrollementRepo.delete(enrollment.id)
    }
}