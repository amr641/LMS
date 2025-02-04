import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToOne,
    JoinColumn
} from "typeorm";
import { PaymentStatus } from "../enums/payment.status";
import { Status } from "../enums/enrollment.status";
import { IEnrollment } from "../interfaces/enrollment.INTF";
import { User } from "./user.model";
import { Payment } from "./payment.model";
import { Course } from "./course.model";

@Entity()
export class Enrollment extends BaseEntity implements IEnrollment {
    @PrimaryGeneratedColumn()
    id!: number;
    @OneToOne(() => Course, (course) => course.id)
    @JoinColumn()
    course!: number;
    
    @OneToOne(() => User, (user) => user.id)
    @JoinColumn()
    student!: number;

    @CreateDateColumn()
    enrollmentDate!: Date; // When the enrollment was made

    @Column({ type: "enum", enum: Status, default: Status.PENDING })
    status!: Status; // Status of the enrollment

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PAID })
    paymentStatus!: PaymentStatus; // Payment status

    @Column({ type: "varchar", length: 255 })
    courseTitle!: string; // Optional: Title of the course (can be populated when enrolling)

    @Column({ type: "decimal", nullable: true })
    coursePrice!: number;
    @OneToOne(() => Payment, (payment: Payment) => payment.id)
    payment!: number;

    @Column({ type: "boolean", default: true })
    isActive!: boolean; // Whether the enrollment is active

    @UpdateDateColumn()
    updatedAt!: Date; // The last updated timestamp
}
