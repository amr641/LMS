import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm';
import { ICategory } from '../interfaces/category.INTF';
import { CourseCategory } from '../enums/category.names';

@Entity()
export class Category extends BaseEntity implements ICategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "enum", enum: CourseCategory, default: CourseCategory.WebDevelopment, unique: true })
    name!: CourseCategory;
    @Column({ type: "text" })
    description!: string ;
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
