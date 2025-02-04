import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
const message = "success"
export class PaymentController {
    private readonly paymentServices: PaymentService
    constructor() {
        this.paymentServices = new PaymentService()
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
        res.status(201).json({message,payment})
    }
    async deletePayment (req:Request,res:Response){
        let { id } = req.params
        await this.paymentServices.deletePayment(Number(id))
        res.status(200).json({message:`payment with id :${id} deleted successfullly`})
    }
}