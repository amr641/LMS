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
import { IMaterial } from "../interfaces/materials.INTF";
import { Course } from "./course.model";

@Entity()
export class Material extends BaseEntity implements IMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 45 })
  title!: string;
  @JoinColumn({name:"course"})
  @OneToOne(() => Course, (course) => course.id)
  course!: number;
  @Column({ type: "varchar", length: 45, nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 255 })
  file!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
