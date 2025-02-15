import { Request, Response } from "express";
import { SubmissionServices } from "../services/submission.service";
import { AppDataSource } from "../config/dbConfig";
import { Submission } from "../models/submission.model";
import { CloudUploader } from "../utils/cloudinary.utils";
const message = "success";

export class SubmissionController {
    private readonly submissionServices: SubmissionServices;
    constructor() {
        this.submissionServices = new SubmissionServices(AppDataSource.getRepository(Submission), new CloudUploader())
    }
    async submitAssignment(req: Request, res: Response) {
        let file: any = req.files?.file
        let submission = await this.submissionServices.submitAssignment({
            file: file?.data,
            student: Number(req.user?.id),
            
            assignment: Number(req.body.assignment),

        })
        res.status(201).json({ message, submission })
    }
    async getAllSubmissions(req: Request, res: Response) {
        let submissions = await this.submissionServices.getAllSubmissions();
        res.status(200).json({ message, submissions })
    }
    async getAssignmentSubmissions(req: Request, res: Response) {
        let { assignmentId } = req.params;
        let submissions = await this.submissionServices.getAssignmentSubmissions(Number(assignmentId))
        res.status(200).json({ message, submissions })
    }
    async updateSubmission(req: Request, res: Response) {
        let { id } = req.params
        let file: any = req.files?.file
        let submission = await this.submissionServices.updateSubmission(Number(id), {
            grade: Number(req.body.grade),
            file: file ? file.data : undefined
        })
        res.status(201).json({ message, submission })
    }
    async getSubmission(req: Request, res: Response) {
        let { id } = req.params
        let submission = await this.submissionServices.getSubmission(Number(id))
        res.status(200).json({ message, submission })
    }
    async deleteSubmission(req: Request, res: Response) {
        let { id } = req.params
        await this.submissionServices.deleteSubmission(Number(id))
        res.status(200).json({ message: `Submission With Id : ${id} Deleted Successfully` })
    }
}