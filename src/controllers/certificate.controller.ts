import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { generateCertificate } from "../helpers/certificateGenerator";

export class Certificate {
    private readonly courseServices: CourseService;
    constructor() {
        this.courseServices = new CourseService()
    }
    async getMyCertificate(req: Request, res: Response) {
        let userName = req.user?.email;
        let { id } = req.params
        let course = await this.courseServices.getCourse(Number(id))
        
        try {
            const pdfBuffer = await generateCertificate(userName ? userName : "not provided", course.title);

            // Send buffer as a file response without storing it
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=certificate-${userName}.pdf`);
            res.end(pdfBuffer);
        } catch (error) {
            res.status(500).send("Error generating certificate.");
        }

    }
}

