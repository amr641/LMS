import { PaymentMethods } from "../enums/payment.method";
import { PaymentStatus } from "../enums/payment.status";

 interface IPayment {
    id: number;
    amount: number; // Store as string to accommodate different formats (e.g., currency)
    status: PaymentStatus; // Payment status
    method: PaymentMethods;// Payment method
    user: number;
    description?: string; // Optional description for the payment
    createdAt: Date; // Date the payment was made
    updatedAt: Date; // Date the payment was last updated
}

interface PaymentDto {
    amount: number;
    description?: string;
    user:number;
    status?: PaymentStatus; // Payment status
    method?: PaymentMethods;// Payment method
}
export {IPayment,PaymentDto}