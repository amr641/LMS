import { Router } from "express";
import { MaterialController } from "../controllers/materials.controller";
import fileUpload from 'express-fileupload';
import { allowedTo } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
import { verifyToken } from "../middlewares/verifiyToken";


export const materialRouter = Router();
const materialController = new MaterialController()
materialRouter
    .use(fileUpload({ useTempFiles: false }))
    .use(verifyToken)
    .post("/", materialController.addMaterials.bind(materialController))
    .get("/", materialController.getAllMaterials.bind(materialController))
    .get("/course/:courseId", materialController.getCourseMaterials.bind(materialController))

    .route("/:id")
    .get(materialController.getMaterial.bind(materialController))
    .patch(materialController.updateMaterial.bind(materialController))
    .delete(materialController.deleteMaterial.bind(materialController))