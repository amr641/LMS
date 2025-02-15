import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { ICategory } from "../interfaces/category.INTF";

export class CategoryController {
    private categoryService: CategoryService
    constructor() {
        this.categoryService = new CategoryService()
    }
    async createCategory(req: Request, res: Response) {
        let { name, description } = req.body
        let category: ICategory = await this.categoryService.createCategory({ name, description })
        res.status(201).json({ message: "success", category })
    }
    async getCategories(req: Request, res: Response) {
        let categories = await this.categoryService.getAllCategoris()
        res.status(200).json({ message: "success", categories })
    }
    async getCategory(req: Request, res: Response) {
        let { id } = req.params
        let category = await this.categoryService.getCategory(Number(id))
        res.status(200).json({ message: "success", category })
    }
    async editCategory(req: Request, res: Response) {
        let { name, description } = req.body
        let category = await this.categoryService.updateCategory({
            id: Number(req.params.id),
            name: name || undefined,
            description: description || undefined
        })
        res.status(201).json({ message: "success", category })
    }
    async deleteCategory(req: Request, res: Response) {
        await this.categoryService.deletecategory(Number(req.params.id))
        res.status(201).json({ message: `category with id : ${req.params.id} deleted successfully` })
    }
}