import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { IPayment } from "../interfaces/payment.INTF";
import { PaymentStatus } from "../enums/payment.status";
import { PaymentMethods } from "../enums/payment.method";
import { User } from "./user.model";
@Entity()
export class Payment extends BaseEntity implements IPayment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 45 })
    amount!: string;

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    status!: PaymentStatus

    @Column({
        type: "enum",
        enum: PaymentMethods, 
        default: PaymentMethods.OTHERS, 
    })
    method!: PaymentMethods; 
    @ManyToOne(() => User, (user) => user.id)
    user!: number;
    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}