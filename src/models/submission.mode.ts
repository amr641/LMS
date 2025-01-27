import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne
} from "typeorm";

import { ISubmission } from "../interfaces/submission.INTF";
import { Assignment } from "./assignments.model";
import { User } from "./user.model";

@Entity()
export class Submission extends BaseEntity implements ISubmission {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column({ type: "date" })
  submissionDate!: Date;

  @Column({ type: "varchar", length: 255 })
  file!: string;  // File path or URL to the submitted file
  @ManyToOne(() => Assignment, (assignment) => assignment.id)
  assignment!:number
  @ManyToOne(() => User, (user) => user.id)
  user!:number
  @Column({ type: "decimal", nullable: true })
  grade?: number;  // Optional grade for the submission

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
