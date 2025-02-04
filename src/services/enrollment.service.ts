import { Repository } from "typeorm";

import { AppDataSource } from "../config/dbConfig";
import { EnrollmentDTO, IEnrollment } from "../interfaces/enrollment.INTF";
import { PaymentService } from "./payment.service";
import { CourseService } from "./course.service";
import { AppError } from "../utils/appError";
import { Enrollment } from "../models/enrollment.model";

export class EnrollmentServices {
    private readonly enrollementRepo: Repository<Enrollment>;
    private paymentServices: PaymentService;
    private courseServices: CourseService

    constructor() {
        this.enrollementRepo = AppDataSource.getRepository(Enrollment);
        this.paymentServices = new PaymentService();
        this.courseServices = new CourseService()

    }

    async createEnrollment(enrollmentData: EnrollmentDTO) {
        let course = await this.courseServices.getCourse(enrollmentData.courseId)
        await this.paymentServices.createOrder({
            amount: course.price ? Number(course.price) : 0,
            description: course.description,
            user: enrollmentData.student
        })
     
        
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
        let enrollments: IEnrollment[] | [] = await this.enrollementRepo.find()
        if (!enrollments.length) throw new AppError("Out Of Enrollments", 404)
        return enrollments
    }
    async updateEnrollment(enrollmentData: EnrollmentDTO,id:number) {
        let enrollment = await this.enrollementRepo.findOne({ where: { id }})
        if (!enrollment) throw new AppError("enrollment not found", 404)
        Object.assign(enrollment,enrollmentData)
        enrollment = await this.enrollementRepo.save(enrollment)
        return enrollment

    }
    async deleteEnrollment(id: number) {
        let enrollment = await this.enrollementRepo.findOne({ where: { id } })
        if (!enrollment) throw new AppError("enrollment not found", 404)
        await this.enrollementRepo.delete(enrollment.id)
    }
}