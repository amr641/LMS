import { Status } from "../enums/enrollment.status";
import { PaymentStatus } from "../enums/payment.status";

interface IEnrollment {
  id: number;
  course: number;
  enrollmentDate?: Date;
  status?: Status;
  student?: number;
  paymentStatus?: PaymentStatus;
  courseTitle: string;
  coursePrice: number;
  isActive: boolean;
}

interface EnrollmentDTO {
  id?:number;
  courseId: number;
  enrollmentDate?: Date;
  status?: Status;
  student?: number
  paymentStatus?: PaymentStatus;
  courseTitle?: string;
  coursePrice?: number;
}

export { IEnrollment, EnrollmentDTO }