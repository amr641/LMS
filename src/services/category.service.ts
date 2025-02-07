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
        let categories: [ICategory[], number] = await this.categoryRepo.findAndCount();
        if (!categories[1]) throw new AppError("Out Of categories", 404)
        return categories
    }
    async updateCategory(data: CategoryDto) {
        let category = await this.categoryRepo.findOne({ where: { id: data.id } });
        if (!category) throw new AppError("category not found", 404);
        Object.assign(category, {
            name: data.name,
            description: data.description
        });
        category = await this.categoryRepo.save(category);
        return category;
    }
    async deletecategory (id:number){
        let category = await this.categoryRepo.findOne({ where: {id} });

       await this.categoryRepo.delete(id);
  
    }


}