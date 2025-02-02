import { Router } from "express";
import { verifyToken } from "../middlewares/verifiyToken";
import { CourseController } from "../controllers/course.controller";
import { validateCategoryExists } from "../middlewares/validateCategoryExists";
import { allowedTo, authorizeInstructor } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";

export const courseRouter = Router()
const courseController = new CourseController()
courseRouter.use(verifyToken)
    .get("/courses", courseController.getAllCourses.bind(courseController))
    .get("/courses/:id", courseController.getCourse.bind(courseController))


    .post("/courses", allowedTo(Roles.INSTRUCTOR), validateCategoryExists, courseController.createCourse.bind(courseController))
    .get("/category/:categoryId/courses", validateCategoryExists, courseController.getCategoryCourses.bind(courseController))
    .get("/category/:categoryId/courses/:courseId", validateCategoryExists, courseController.getCourseFromCategory.bind(courseController))

    .delete("/courses/:id", authorizeInstructor, allowedTo(Roles.ADMIN, Roles.INSTRUCTOR), courseController.deleteCourse.bind(courseController))
    .patch("/courses/:id", authorizeInstructor, allowedTo(Roles.ADMIN, Roles.INSTRUCTOR), courseController.updateCourse.bind(courseController))