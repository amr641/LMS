import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { CourseService } from "../services/course.service";
import { AppDataSource } from "../config/dbConfig";
import { Payment } from "../models/payment.model";
import { Course } from "../models/course.model";
import { redisServices } from "../config/redisConfig";

const message = "success"

export class PaymentController {
    private readonly paymentServices: PaymentService
    private readonly courseServices: CourseService

    constructor() {
        this.paymentServices = new PaymentService(AppDataSource.getRepository(Payment))
        this.courseServices = new CourseService(AppDataSource.getRepository(Course),redisServices)
    }
    async createPayment(req: Request, res: Response) {
        let { course } = req.body
        let user = req.user?.id
        let isCourse = await this.courseServices.getCourse(Number(course))
        let url = await this.paymentServices.createOrder({
            description: isCourse.title,
            amount: isCourse.price ? isCourse.price : 0,
            user: Number(user)
        })
        res.status(200).json({ url })
    }
    async getPayment(req: Request, res: Response) {
        let { id } = req.params
        let payment = await this.paymentServices.getPayment(Number(id))
        res.status(200).json({ message, payment })
    }
    async getAllPayments(req: Request, res: Response) {
        let payments = await this.paymentServices.getAllPayments()
        res.status(200).json({ message, payments })
    }
    async updatePayment(req: Request, res: Response) {
        let { id } = req.params
        let payment = await this.paymentServices.updatePayment(req.body, Number(id))
        res.status(201).json({ message, payment })
    }
    async handelSuccess(req: Request, res: Response) {

        let { userId } = req.params
        let { title } = req.query
        let payment = await this.paymentServices.handleSuccess({ user: Number(userId), description: title as string })
        res.status(200).json({ message: "success", payment })
    }
    async handleCanceledPayment(req: Request, res: Response) {
        let { userId } = req.params
        let { title } = req.query
        let payment = await this.paymentServices.handleCancel({ user: Number(userId), description: title as string })
        res.status(201).json({ message: "Payment Canceled", payment })
    }
    async deletePayment(req: Request, res: Response) {
        let { id } = req.params
        await this.paymentServices.deletePayment(Number(id))
        res.status(200).json({ message: `payment with id :${id} deleted successfullly` })
    }
}