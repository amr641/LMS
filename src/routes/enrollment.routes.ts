import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import { allowedTo } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
const enrollmentController = new EnrollmentController()
export const enrollementRouter = Router();
enrollementRouter
    .use(verifyToken)
    .post("/", allowedTo(Roles.STUDENT),enrollmentController.createEnrollment.bind(enrollmentController))
    .use(allowedTo(Roles.ADMIN))
    .get("/", enrollmentController.getAllEnrollments.bind(enrollmentController))

    .route("/:id")
    .get(enrollmentController.getEnrollment.bind(enrollmentController))
    .patch(enrollmentController.updateEnrollment.bind(enrollmentController))
    .delete(enrollmentController.deleteEnrollment.bind(enrollmentController));
