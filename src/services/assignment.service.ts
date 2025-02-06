import { Repository } from "typeorm";
import { Assignment } from "../models/assignments.model";
import { AppDataSource } from "../config/dbConfig";
import { AssignmentDTO, IAssignment } from "../interfaces/assignment.INTF";
import { AppError } from "../utils/appError";
import { CloudUploader } from "../utils/cloudinary.utils";

export class AssignmentServices {
    private readonly assignmentRepo: Repository<Assignment>
    private readonly uploader: CloudUploader
    constructor() {
        this.assignmentRepo = AppDataSource.getRepository(Assignment)
        this.uploader = new CloudUploader()
    }

    async addAssignment(assignmentData: AssignmentDTO) {
        if (!assignmentData.description) throw new AppError("No Files Provided", 400)

        let assignment: IAssignment = this.assignmentRepo.create({
            course: assignmentData.course,
            dueDate: assignmentData.dueDate,
            title: assignmentData.title,
            description: await this.uploader.uploadToCloudinary(assignmentData.description)
        })
        await this.assignmentRepo.save(assignment)
        return assignment

    }

    async getAllAssignments() {
        let assignments: IAssignment[] | [] = await this.assignmentRepo.find();
        if (!assignments.length) throw new AppError("No Assignments Provided", 404)
        return assignments
    }

    async getAssignment(id: number) {
        let assignment: IAssignment | null = await this.assignmentRepo.findOne({ where: { id } });
        if (!assignment) throw new AppError("Assignment Not Found", 404)
        return assignment
    }

    async getCourseAssignments(courseId: number) {
          
        let assignments: IAssignment[] = await this.assignmentRepo
        .createQueryBuilder("assignment")
        .innerJoin("assignment.course", "course")  // This refers to the "course" relation
        .where("course.id = :courseId", { courseId })
        .getMany();

        if (!assignments.length) throw new AppError("No Assignments provided for this course", 404)
        return assignments
    }

    async updateAssignment(id: number, assignmentData: AssignmentDTO) {
        let assignment: IAssignment | null = await this.assignmentRepo.findOne({ where: { id } });
        if (!assignment) throw new AppError("Assignment Not Found", 404)
        if (assignmentData.description) { // if user provide a file
            await this.uploader.removeOldFile(assignment.description) // remove the old image
            // Modeify the old one with the new image
            assignmentData.description = await this.uploader.uploadToCloudinary(assignmentData.description)
        }
        
        Object.assign(assignment, assignmentData)
        assignment = await this.assignmentRepo.save(assignment)
        return assignment
    }

    async deleteAssignment(id: number) {
        let assignment: IAssignment | null = await this.assignmentRepo.findOne({ where: { id } });
        if (!assignment) throw new AppError("Assignment Not Found", 404)
            await this.uploader.removeOldFile(assignment.description)
        await this.assignmentRepo.delete(id)
    }
}