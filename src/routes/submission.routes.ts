import { Router } from "express";
import { SubmissionController } from "../controllers/submission.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import fileUpload from "express-fileupload";
import { isSubmissionAllowed } from "../middlewares/validateExistence";
import { allowedTo, authorizeStudent } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";

export const submissionRouter = Router();
const submissionController = new SubmissionController()
submissionRouter
    .use(verifyToken)
    .use(fileUpload({ useTempFiles: false }))
    .post("/", isSubmissionAllowed, authorizeStudent, submissionController.submitAssignment.bind(submissionController))
    .get("/", submissionController.getAllSubmissions.bind(submissionController))
    .get("/assignment/:assignmentId", submissionController.getAssignmentSubmissions.bind(submissionController))
    .route("/:id")
    .get(submissionController.getSubmission.bind(submissionController))
    .patch(allowedTo(Roles.INSTRUCTOR), submissionController.updateSubmission.bind(submissionController))
    .delete(submissionController.deleteSubmission.bind(submissionController));