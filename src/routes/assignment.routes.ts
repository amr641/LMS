import { Router } from "express";
import { AssignmetController } from "../controllers/assignment.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import fileUpload from "express-fileupload";
import { allowedTo, authorizeStudent } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";

export const assignmentRouter = Router()
const assignmentController=  new AssignmetController()
assignmentRouter
.use(verifyToken)
 .use(fileUpload({ useTempFiles: false }))
.post("/",allowedTo(Roles.INSTRUCTOR),assignmentController.addAssignment.bind(assignmentController))
.get("/",assignmentController.getAllAssignments.bind(assignmentController))
.get("/course/:courseId",allowedTo(Roles.STUDENT,Roles.ADMIN),authorizeStudent,assignmentController.getCourseAssignments.bind(assignmentController))

.route("/:id")
.get(allowedTo(Roles.ADMIN),assignmentController.getAssignment.bind(assignmentController))
.patch(allowedTo(Roles.INSTRUCTOR),assignmentController.updateAssignments.bind(assignmentController))
.delete(allowedTo(Roles.ADMIN,Roles.INSTRUCTOR),assignmentController.deleteAssignment.bind(assignmentController))