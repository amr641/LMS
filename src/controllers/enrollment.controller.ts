import { Response, Request } from "express";
import { EnrollmentServices } from "../services/enrollment.service";
import { IEnrollment } from "../interfaces/enrollment.INTF";
const message = "success"
export class EnrollmentController {
    private readonly enrollmentServices: EnrollmentServices
    constructor() {
        this.enrollmentServices = new EnrollmentServices()
    }
    async createEnrollment(req: Request, res: Response) {
        let enrollment = await this.enrollmentServices.createEnrollment({
            student: Number(req.user?.id),
            enrollmentDate: new Date(req.body.enrollmentDate),
            ...req.body
 
        })


        res.status(200).json({ message: "done", enrollment })
    }
    async getAllEnrollments(req: Request, res: Response) {
        let enrollments: IEnrollment[] = await this.enrollmentServices.getAllEnrollments();
        res.status(200).json({ message, enrollments })
    }
    async getEnrollment(req: Request, res: Response) {
        let { id } = req.params
        let enrollment: IEnrollment = await this.enrollmentServices.getEnrollment(Number(id))
        console.log(enrollment.student);

        res.status(200).json({ message, enrollment })
    }
    async updateEnrollment(req: Request, res: Response) {
        let { id } = req.params
        let enrollment = await this.enrollmentServices.updateEnrollment({ ...req.body }, Number(id))
        res.status(201).json({ message, enrollment })
    }
    async deleteEnrollment(req: Request, res: Response) {
        let { id } = req.params
        await this.enrollmentServices.deleteEnrollment(Number(id))
        res.status(200).json({ message: `Enrollment with id :${id} deleted successfully` })
    }
}