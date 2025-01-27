import { Status } from "../enums/enrollment.status";
import { PaymentStatus } from "../enums/payment.status";

export interface IEnrollment {
    id: number;
    userId: number; 
    courseId: number; 
    enrollmentDate: Date;
    status: Status; 
    student:number
    paymentStatus: PaymentStatus; 
    courseTitle: string; 
    coursePrice: number; 
    completionDate?: Date; 
    isActive: boolean; 
  }
  