import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IUser } from "../interfaces/user.INTF";
import { Roles } from "../enums/roles.enum";


@Entity() 
export class User extends BaseEntity implements IUser {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;
    @Column({ type: "integer" })
    phone!: number
    @Column({ type: "varchar" })
    password!: string;
    @Column({ type: "enum", enum: Roles, default: Roles.STUDENT })
    role!: Roles;
    @Column({ type: "date" })
    DOB!: Date;
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
