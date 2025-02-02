import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import { allowedTo, restrictAdminActions } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
//  ADMIN ACTIONS
export const userRouter = Router()
const userController = new UserController();
userRouter.
    use(verifyToken, allowedTo(Roles.ADMIN))

    .get("/", userController.getAllUsers.bind(userController))
    .route("/:id")
    .get(userController.getUser.bind(userController))
    .patch(restrictAdminActions, userController.editUser.bind(userController))
    .delete(restrictAdminActions, userController.deleteUser.bind(userController))