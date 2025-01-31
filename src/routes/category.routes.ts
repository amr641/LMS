import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifiyToken";
let categoryController = new CategoryController()
export const categoryRouter = Router()
categoryRouter.use(verifyToken)
categoryRouter.post("/", categoryController.createCategory.bind(categoryController))
categoryRouter.get("/", categoryController.getCategories.bind(categoryController))
categoryRouter.patch("/:id", categoryController.editCategory.bind(categoryController))
categoryRouter.delete("/:id", categoryController.deleteCategory.bind(categoryController))