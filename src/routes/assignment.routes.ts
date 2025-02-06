import { Router } from "express";
import { AssignmetController } from "../controllers/assignment.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import fileUpload from "express-fileupload";

export const assignmentRouter = Router()
const assignmentController=  new AssignmetController()
assignmentRouter
.use(verifyToken)
 .use(fileUpload({ useTempFiles: false }))
.post("/",assignmentController.addAssignment.bind(assignmentController))
.get("/",assignmentController.getAllAssignments.bind(assignmentController))
.get("/course/:courseId",assignmentController.getCourseAssignments.bind(assignmentController))

.route("/:id")
.get(assignmentController.getAssignment.bind(assignmentController))
.patch(assignmentController.updateAssignments.bind(assignmentController))
.delete(assignmentController.deleteAssignment.bind(assignmentController))