import { Request, Response } from "express";
import { AssignmentServices } from "../services/assignment.service";
const message = "message"
export class AssignmetController {
    private readonly assignmentServices: AssignmentServices;
    constructor() {
        this.assignmentServices = new AssignmentServices()
    }
    async addAssignment(req: Request, res: Response) {
        let file: any = req.files?.description
        let { title, dueDate, course } = req.body
        console.log(dueDate);
        
        let assignment = await this.assignmentServices.addAssignment({
            course: Number(course),
            title,
            dueDate: new Date(dueDate),
            description: file?.data // sending the file Buffer
        })
        res.status(201).json({ message, assignment })
    }
    async getAllAssignments(req: Request, res: Response) {
        let assignments = await this.assignmentServices.getAllAssignments()
        res.status(200).json({ message, assignments })
    }
    async getAssignment(req: Request, res: Response) {
        let { id } = req.params
        let assignment = await this.assignmentServices.getAssignment(Number(id))
        res.status(200).json({ message, assignment })
    }
    async getCourseAssignments(req: Request, res: Response) {
        let { courseId } = req.params;
        let assignments = await this.assignmentServices.getCourseAssignments(Number(courseId));
        res.status(200).json({ message, assignments })
    }
    async updateAssignments(req: Request, res: Response) {
        let { id } = req.params
        let file: any = req.files?.description
        let assignment = await this.assignmentServices.updateAssignment(Number(id), {
            description: file.data,
            ...req.body


        });
        res.status(201).json({ message, assignment })
    }
    async deleteAssignment(req: Request, res: Response) {
        let { id } = req.params
        await this.assignmentServices.deleteAssignment(Number(id))
        res.status(200).json({ message: `Assignment With Id: ${id} deleted Successfully` })
    }
}