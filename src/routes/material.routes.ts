import { Router } from "express";
import { MaterialController } from "../controllers/materials.controller";
import fileUpload from 'express-fileupload';
import { allowedTo, authorizeStudent } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
import { verifyToken } from "../middlewares/verifiyToken";


export const materialRouter = Router();
const materialController = new MaterialController()
materialRouter
    .use(fileUpload({ useTempFiles: false }))
    .use(verifyToken)
    .post("/", allowedTo(Roles.INSTRUCTOR), materialController.addMaterials.bind(materialController))
    .get("/", allowedTo(Roles.ADMIN), materialController.getAllMaterials.bind(materialController))
    .get("/course/:courseId", allowedTo(Roles.ADMIN, Roles.STUDENT), authorizeStudent, materialController.getCourseMaterials.bind(materialController))

    .route("/:id")
    .get(allowedTo(Roles.ADMIN), materialController.getMaterial.bind(materialController))
    .patch(allowedTo(Roles.INSTRUCTOR), materialController.updateMaterial.bind(materialController))
    .delete(allowedTo(Roles.ADMIN), materialController.deleteMaterial.bind(materialController));
    