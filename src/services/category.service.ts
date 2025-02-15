import { Repository } from "typeorm";
import { Category } from "../models/category.model";
import { AppDataSource } from "../config/dbConfig";

import { CategoryDto, ICategory } from "../interfaces/category.INTF";
import { AppError } from "../utils/appError";

export class CategoryService {
    private categoryRepo: Repository<Category>
    constructor() {
        this.categoryRepo = AppDataSource.getRepository(Category)
    }
    async createCategory(categoryData: CategoryDto) {
        let category = this.categoryRepo.create(categoryData)
        await this.categoryRepo.save(category)
        return category

    }
    async getAllCategoris() {
        let categories: ICategory[] = await this.categoryRepo.find();
        if (!categories.length) throw new AppError("Out Of categories", 404)
        return categories
    }
    async getCategory(id: number) {
        let category: ICategory | null = await this.categoryRepo.findOne({ where: { id } });
        if (!category) throw new AppError("Category Not Found", 404)
        return category
    }
    async updateCategory(data: CategoryDto) {
        if (!data.id) throw new AppError("Please Provide the Required Data", 400)
        let category = await this.getCategory(data?.id)
        Object.assign(category, {
            name: data.name,
            description: data.description
        });
        category = await this.categoryRepo.save(category);
        return category;
    }
    async deletecategory(id: number) {
        let category = await this.getCategory(id);
        await this.categoryRepo.delete(id);
    }


}