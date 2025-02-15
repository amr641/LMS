import { CourseCategory } from "../enums/category.names";

export interface ICategory {
    id: number;
    name: CourseCategory;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CategoryDto {
    id?:number
    name:CourseCategory,
    description:string
}