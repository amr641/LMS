import { PaymentMethods } from "../enums/payment.method";
import { PaymentStatus } from "../enums/payment.status";

export interface IPayment {
    id: number;
    amount: string; // Store as string to accommodate different formats (e.g., currency)
    status: PaymentStatus; // Payment status
    method: PaymentMethods;// Payment method
    user: number;
    description?: string; // Optional description for the payment
    createdAt: Date; // Date the payment was made
    updatedAt: Date; // Date the payment was last updated
}
