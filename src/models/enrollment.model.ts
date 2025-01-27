import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToOne
} from "typeorm";
import { PaymentStatus } from "../enums/payment.status";
import { Status } from "../enums/enrollment.status";
import { IEnrollment } from "../interfaces/enrollment.INTF";
import { User } from "./user.model";
import { Payment } from "./payment.model";

@Entity()
export class Enrollment extends BaseEntity implements IEnrollment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number; // Reference to the user (student) enrolling

    @Column()
    courseId!: number; // Reference to the course the user is enrolling in

    @CreateDateColumn()
    enrollmentDate!: Date; // When the enrollment was made

    @Column({ type: "enum", enum: Status, default: Status.PENDING })
    status!: Status; // Status of the enrollment

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus!: PaymentStatus; // Payment status

    @Column({ type: "varchar", length: 255 })
    courseTitle!: string; // Optional: Title of the course (can be populated when enrolling)

    @Column({ type: "decimal", nullable: true })
    coursePrice!: number; // Optional: Price of the course (can be populated when enrolling)
    @OneToOne(() => User, (user) => user.id)
    student!: number;
    @OneToOne(() => Payment, (payment) => payment.id)
    payment!: number;
    @Column({ type: "date", nullable: true })
    completionDate?: Date; // Optional: Completion date for completed courses

    @Column({ type: "boolean", default: true })
    isActive!: boolean; // Whether the enrollment is active

    @UpdateDateColumn()
    updatedAt!: Date; // The last updated timestamp
}
