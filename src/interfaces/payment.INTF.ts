import { PaymentMethods } from "../enums/payment.method";
import { PaymentStatus } from "../enums/payment.status";

 interface IPayment {
    id: number;
    amount: number; 
    status: PaymentStatus; 
    method: PaymentMethods;
    user: number;
    description?: string; 
    createdAt: Date; 
    updatedAt: Date; 
}

interface PaymentDto {
    amount: number;
    description?: string;
    user:number;
    status?: PaymentStatus; // Payment status
    method?: PaymentMethods;// Payment method
}

interface successPayment {
    description?: string;
    user:number;
}
export {IPayment,PaymentDto,successPayment}