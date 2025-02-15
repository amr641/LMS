import { Repository } from "typeorm";
import { Submission } from "../models/submission.model";
import { CloudUploader } from "../utils/cloudinary.utils";
import { AppDataSource } from "../config/dbConfig";
import { ISubmission, SubmissionDTO } from "../interfaces/submission.INTF";
import { AppError } from "../utils/appError";

export class SubmissionServices {
    private cloudServices: CloudUploader
    private submissionRepo: Repository<Submission>

    constructor(submissionRepo?: Repository<Submission>, cloudServices?: CloudUploader) {
        this.submissionRepo = AppDataSource.getRepository(Submission) || submissionRepo
        this.cloudServices = cloudServices || new CloudUploader()
    }
    async submitAssignment(submissionData: SubmissionDTO) {
        if (!submissionData.file) throw new AppError("No Files Provided", 400)
        let submission = this.submissionRepo.create({
            assignment: submissionData.assignment,
            file: await this.cloudServices.uploadToCloudinary(submissionData.file),
            student: submissionData.student,
            submissionDate: new Date(),
            grade: submissionData.grade ?? 0,
        })
        await this.submissionRepo.save(submission)
        return submission
    }
    async getAllSubmissions() {
        let submissions: ISubmission[] | [] = await this.submissionRepo.find();
        if (!submissions.length) throw new AppError("No Submissions Provided", 404)
        return submissions
    }
    async getAssignmentSubmissions(assignmentId: number) {
        let submissions: ISubmission[] = await this.submissionRepo
            .createQueryBuilder("submission")
            .innerJoin("submission.assignment", "assignment")
            .where("assignment.id = :assignmentId", { assignmentId })
            .getMany();
        if (!submissions.length) throw new AppError("No Submissions Provided For This Assignment", 404);
        return submissions
    }
    async getSubmission(id: number) {
        let submission: ISubmission | null = await this.submissionRepo.findOne({ where: { id } });
        if (!submission) throw new AppError("Submission Not Found", 404)
        return submission
    }
    async updateSubmission(id: number, submissionData: SubmissionDTO) {
        let submission: ISubmission = await this.getSubmission(id)
        if (submissionData.file) {
            await this.cloudServices.removeOldFile(submission.file)
            submissionData.file = await this.cloudServices.uploadToCloudinary(submissionData.file)
        }
        Object.assign(submission, submissionData);
        submission = await this.submissionRepo.save(submission)
        return submission

    }
    async deleteSubmission(id: number) {
        let submission: ISubmission = await this.getSubmission(id);
        await this.cloudServices.removeOldFile(submission.file)
        await this.submissionRepo.delete(id)

    }
}