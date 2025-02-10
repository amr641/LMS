import {
    ApiError,
    CheckoutPaymentIntent,
    Client, Environment, LogLevel,


    OrdersController,
} from '@paypal/paypal-server-sdk';
import { Repository } from 'typeorm';
import { Payment } from '../models/payment.model';
import { AppDataSource } from '../config/dbConfig';
import { IPayment, PaymentDto, successPayment } from '../interfaces/payment.INTF';
import { AppError } from '../utils/appError';
import { OrdersCaptureRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import axios from 'axios';
import { Status } from '../enums/enrollment.status';
import { PaymentStatus } from '../enums/payment.status';
import { object } from 'joi';

export class PaymentService {
    private readonly paymentRepo: Repository<Payment>


    constructor() {
        this.initializePayPal();
        this.paymentRepo = AppDataSource.getRepository(Payment)

    }
    private async initializePayPal() {
        return new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: process.env.PAYPAL_CLIENT_ID as string,
                oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET as string,
            },
            timeout: 0,
            environment: Environment.Sandbox,
            logging: {
                logLevel: LogLevel.Info,
                logRequest: { logBody: false },
                logResponse: { logHeaders: false },
            },

        })
    }
    async createOrder(paymentData: PaymentDto) {
        const ordersController = new OrdersController(await this.initializePayPal());
        const orderDetails = {
            body: {
                intent: CheckoutPaymentIntent.CAPTURE,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: paymentData.amount.toString(),
                        },
                    },
                ],
                applicationContext: {
                    returnUrl: `${process.env.BASE_URL}/payments/success/${paymentData.user}?title=${encodeURIComponent(paymentData.description as string
                    )}`,
                    cancelUrl: `${process.env.BASE_URL}/payments/cancel`,
                },
            },
            prefer: "return=minimal",
        };

        const { body, ...httpResponse } = await ordersController.ordersCreate(orderDetails);
        let payment = this.paymentRepo.create({
            amount: paymentData.amount,
            user: paymentData.user,
            description: paymentData.description
        })
        await this.paymentRepo.save(payment)
        let bodyParesd: any = JSON.parse(body as string)
        console.log(bodyParesd.links[1]?.href);
        
        return bodyParesd.links[1]?.href

    }

    async getPayment(id: number) {
        let payment: IPayment | null = await this.paymentRepo.findOne({ where: { id } })
        if (!payment) throw new AppError("payment not found", 404)
        return payment
    }
    async handleSuccess(successData: successPayment) {
        let payment = await this.paymentRepo.createQueryBuilder("payment")
        .where("payment.user = :user", { user: successData.user })
        .andWhere("payment.description = :description", { description: successData.description })
        .getOne();
    console.log();
    
        
        if (!payment) throw new AppError("Failed getting the payment", 500);
        Object.assign(payment,{status:PaymentStatus.PAID})
      payment=   await this.paymentRepo.save(payment)
      return payment
    }
  
    async getAllPayments() {
        let payments: IPayment[] | [] = await this.paymentRepo.find()
        if (!payments.length) throw new AppError("Out Of Payments", 404)
        return payments
    }


    async updatePayment(paymentData: PaymentDto, id: number) {
        let payment = await this.getPayment(id)
        Object.assign(payment, paymentData)
        payment = await this.paymentRepo.save(payment)
        return payment

    }
    async capturePayment() {

    }
    async deletePayment(id: number) {
        await this.getPayment(id)

        await this.paymentRepo.delete(id)
    }



}