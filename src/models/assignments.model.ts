import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne
} from "typeorm";
import { IAssignment } from "../interfaces/assignment.INTF";
import { Course } from "./course.model";

@Entity()
export class Assignment extends BaseEntity implements IAssignment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 45 })
  title!: string;

  @Column({ type: "varchar", length: 45 })
  description!: string;

  @Column({ type: "date" })
  dueDate!: Date;
  @ManyToOne(() => Course, (course) => course.id)
  course!: number
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
