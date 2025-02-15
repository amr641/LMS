import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import { allowedTo } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
let categoryController = new CategoryController()
export const categoryRouter = Router()

categoryRouter.use(verifyToken)
    .get("/", categoryController.getCategories.bind(categoryController))

    .use(allowedTo(Roles.ADMIN))

    .post("/", categoryController.createCategory.bind(categoryController))

    .patch("/:id", categoryController.editCategory.bind(categoryController))
    .get("/:id", categoryController.getCategory.bind(categoryController))

    .delete("/:id", categoryController.deleteCategory.bind(categoryController));