import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import { AppError } from "../utils/appError";
import { Payment } from "../models/payment.model";
import { PaymentService } from "../services/payment.service";
import { PaymentDto, successPayment } from "../interfaces/payment.INTF";
import { PaymentStatus } from "../enums/payment.status";
import { Client, OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

jest.mock("../config/dbConfig", () => ({
    AppDataSource: {
        getRepository: jest.fn()
    }
}));

jest.mock('@paypal/paypal-server-sdk', () => ({
    Client: jest.fn().mockImplementation(() => ({
        // Mock any methods you need from the Client class
    })),
    OrdersController: jest.fn().mockImplementation(() => ({
        ordersCreate: jest.fn().mockResolvedValue({
            body: JSON.stringify({
                links: [{ href: 'http://approve-link.com' }, { href: 'http://capture-link.com' }]
            })
        })
    })),
    CheckoutPaymentIntent: {
        CAPTURE: 'CAPTURE'
    },
    Environment: {
        Sandbox: 'Sandbox'
    },
    LogLevel: {
        Info: 'Info'
    }
}));

describe("PaymentService", () => {
    let paymentService: PaymentService;
    let mockRepo: jest.Mocked<Repository<Payment>>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn()
            }))
        } as unknown as jest.Mocked<Repository<Payment>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

        paymentService = new PaymentService(mockRepo);
    });

    describe("createOrder", () => {
        it("should create a new payment order and return the approval link", async () => {
            const paymentData: PaymentDto = {
                amount: 100,
                user: 1,
                description: "Test payment"
            };

            const mockPayment = Object.assign(new Payment(), {
                id: 1,
                amount: paymentData.amount,
                user: paymentData.user,
                description: paymentData.description,
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            mockRepo.create.mockReturnValue(mockPayment);
            mockRepo.save.mockResolvedValue(mockPayment);

            const result = await paymentService.createOrder(paymentData);

            expect(mockRepo.create).toHaveBeenCalledWith({
                amount: paymentData.amount,
                user: paymentData.user,
                description: paymentData.description
            });
            expect(mockRepo.save).toHaveBeenCalledWith(mockPayment);
            expect(result).toBe("http://capture-link.com");
        });
    });

    describe("getPayment", () => {
        it("should return a payment by ID", async () => {
            const mockPayment = Object.assign(new Payment(), {
                id: 1,
                amount: 33,
                user: 3,
                description: "paymentData.description",
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            mockRepo.findOne.mockResolvedValue(mockPayment);

            const result = await paymentService.getPayment(1);

            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockPayment);
        });

        it("should throw an error if payment is not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(paymentService.getPayment(1)).rejects.toThrow("Payment Not Found");
        });
    });

    describe("handleSuccess", () => {
        it("should update the payment status to PAID", async () => {
            const successData: successPayment = {
                user: 1,
                description: "Test payment"
            };

            const mockPayment = Object.assign(new Payment(), {
                id: 1,
                amount: 33,
                user: 3,
                description: "paymentData.description",
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            (mockRepo.createQueryBuilder as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(mockPayment)
            });

            mockRepo.save.mockResolvedValue({ ...mockPayment, status: PaymentStatus.PAID } as Payment);

            const result = await paymentService.handleSuccess(successData);

            expect(mockRepo.save).toHaveBeenCalledWith({ ...mockPayment, status: PaymentStatus.PAID });
            expect(result.status).toBe(PaymentStatus.PAID);
        });

        it("should throw an error if payment is not found", async () => {
            (mockRepo.createQueryBuilder as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            });

            await expect(paymentService.handleSuccess({ user: 1, description: "Test payment" }))
                .rejects.toThrow("Error Getting The Payment");
        });
    });

    describe("handleCancel", () => {
        it("should update the payment status to CANCELED", async () => {
            const cancelData: successPayment = {
                user: 1,
                description: "Test payment"
            };

            const mockPayment = {
                id: 1,
                amount: 100,
                user: 1,
                description: "Test payment",
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            (mockRepo.createQueryBuilder as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(mockPayment)
            });

            mockRepo.save.mockResolvedValue({ ...mockPayment, status: PaymentStatus.CANCELED } as Payment);

            const result = await paymentService.handleCancel(cancelData);

            expect(mockRepo.save).toHaveBeenCalledWith({ ...mockPayment, status: PaymentStatus.CANCELED });
            expect(result.status).toBe(PaymentStatus.CANCELED);
        });

        it("should throw an error if payment is not found", async () => {
            (mockRepo.createQueryBuilder as jest.Mock).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            });

            await expect(paymentService.handleCancel({ user: 1, description: "Test payment" }))
                .rejects.toThrow("Error Getting The Payment");
        });
    });

    describe("getAllPayments", () => {
        it("should return all payments", async () => {
            const mockPayments = [
                Object.assign(new Payment(), {
                    id: 1,
                    amount: 33,
                    user: 3,
                    description: "paymentData.description",
                    status: PaymentStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

            ];

            mockRepo.find.mockResolvedValue(mockPayments);

            const result = await paymentService.getAllPayments();

            expect(mockRepo.find).toHaveBeenCalled();
            expect(result).toEqual(mockPayments);
        });

        it("should throw an error if no payments exist", async () => {
            mockRepo.find.mockResolvedValue([]);

            await expect(paymentService.getAllPayments()).rejects.toThrow("Out Of Payments");
        });
    });

    describe("updatePayment", () => {
        it("should update a payment", async () => {
            const paymentData: PaymentDto = {
                amount: 150,
                user: 1,
                description: "Updated payment"
            };

            const mockPayment = Object.assign(new Payment(),{
                id: 1,
                amount:33,
                user: 3,
                description: "paymentData.description",
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            mockRepo.findOne.mockResolvedValue(mockPayment);
            mockRepo.save.mockResolvedValue({ ...mockPayment, ...paymentData } as Payment);

            const result = await paymentService.updatePayment(paymentData, 1);

            expect(mockRepo.save).toHaveBeenCalledWith({ ...mockPayment, ...paymentData });
            expect(result.amount).toBe(150);
            expect(result.description).toBe("Updated payment");
        });

        it("should throw an error if payment is not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(paymentService.updatePayment({ amount: 150, user: 1 }, 1))
                .rejects.toThrow("Payment Not Found");
        });
    });

    describe("deletePayment", () => {
        it("should delete a payment", async () => {
            const mockPayment = Object.assign(new Payment(),{
                id: 1,
                amount:33,
                user: 3,
                description: "paymentData.description",
                status: PaymentStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            mockRepo.findOne.mockResolvedValue(mockPayment);
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

            await paymentService.deletePayment(1);

            expect(mockRepo.delete).toHaveBeenCalledWith(1);
        });

        it("should throw an error if payment is not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(paymentService.deletePayment(1)).rejects.toThrow("Payment Not Found");
        });
    });
});