import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/dbConfig";
import { Category } from "../models/category.model";
import { AppError } from "../utils/appError";

 const validateCategoryExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const categoryId = Number(req.params.categoryId);

    const category = await AppDataSource.getRepository(Category).findOneBy({ id: categoryId || req.body.category });
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    next();
};


export {
    validateCategoryExists
}