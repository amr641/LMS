import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne
} from "typeorm";
import { ICourse } from "../interfaces/course.INTF";
import { User } from "./user.model";
import { Category } from "./category.model";


@Entity()
export class Course extends BaseEntity implements ICourse {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text" })
    description!: string;
    
    @ManyToOne(() => User, (user) => user.id)
    instructor!: number;
    @ManyToOne(() => Category, (category) => category.id)
    category!: number;

    @Column({ type: "varchar", length: 20 })
    level!: string;

    @Column({ type: "decimal", nullable: true })
    price!: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    duration!: string;

    @Column({ type: "date", nullable: true })
    startDate!: Date;

    @Column({ type: "date", nullable: true })
    endDate!: Date;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
