import {
    ApiError,
    CheckoutPaymentIntent,
    Client, Environment, LogLevel,

    OrdersController,
} from '@paypal/paypal-server-sdk';
import { Repository } from 'typeorm';
import { Payment } from '../models/payment.model';
import { AppDataSource } from '../config/dbConfig';
import { PaymentDto } from '../interfaces/payment.INTF';

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
                intent: CheckoutPaymentIntent.AUTHORIZE,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: paymentData.amount.toString(),
                        },
                    },
                ],
                "redirect_urls": {
                    "return_url": `"http://127.0.0.1:4000/success"`,
                    "cancel_url": "http://127.0.0.1:4000/err"

                }
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
        return {
            jsonResponse: JSON.parse(body as string),
            httpStatusCode: httpResponse.statusCode,
        };
    }



}