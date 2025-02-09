import { Router } from "express";
import { verifyToken } from "../middlewares/verifiyToken";
import { CourseController } from "../controllers/course.controller";
import { validateCategoryExists } from "../middlewares/validateExistence";
import { allowedTo, authorizeInstructor } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
import { Certificate } from "../controllers/certificate.controller";

export const courseRouter = Router()
const courseController = new CourseController();
const certificates = new Certificate();
courseRouter.use(verifyToken)
    .get("/courses", courseController.getAllCourses.bind(courseController))
    .get("/courses/:id", courseController.getCourse.bind(courseController))
    .get("/courses/:id/get-certificate", certificates.getMyCertificate.bind(certificates))


    .post("/courses", allowedTo(Roles.INSTRUCTOR), validateCategoryExists, courseController.createCourse.bind(courseController))
    .get("/category/:categoryId/courses", validateCategoryExists, courseController.getCategoryCourses.bind(courseController))
    .get("/category/:categoryId/courses/:courseId", validateCategoryExists, courseController.getCourseFromCategory.bind(courseController))

    .delete("/courses/:id", authorizeInstructor, allowedTo(Roles.ADMIN, Roles.INSTRUCTOR), courseController.deleteCourse.bind(courseController))
    .patch("/courses/:id", authorizeInstructor, allowedTo(Roles.ADMIN, Roles.INSTRUCTOR), courseController.updateCourse.bind(courseController))