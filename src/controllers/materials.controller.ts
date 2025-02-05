import { Request, Response } from "express";
import { MaterialServices } from "../services/materials.service";

const message = "success"
export class MaterialController {
    private readonly materialServices: MaterialServices
    constructor() {
        this.materialServices = new MaterialServices()

    }
    async addMaterials(req: Request, res: Response) {
        let file: any = req.files?.file
        let material = await this.materialServices.addMaterial({
            course: Number(req.body.course),
            description: req.body.description,
            title: req.body.title,
            file: file?.data
        })

        res.status(201).json({ message: "success", material })
    }
    async getAllMaterials(req: Request, res: Response) {
        let materials = await this.materialServices.allMaterials()
        res.status(200).json({ message, materials })
    }
    async getMaterial(req: Request, res: Response) {
        let { id } = req.params
        let material = await this.materialServices.getMaterial(Number(id))
        res.status(200).json({ message, material })
    }
    async getCourseMaterials(req: Request, res: Response) {
        let { courseId } = req.params
        let materials = await this.materialServices.CourseMaterials(Number(courseId))
        res.status(200).json({ message, materials })
    }
    async updateMaterial(req: Request, res: Response) {
        let { id } = req.params
        let file: any = req.files?.file
        let material = await this.materialServices.updateMaterials({
            file: file.data || undefined,
            ...req.body
        }, Number(id))
        res.status(201).json({ message, material })
    }
    async deleteMaterial(req: Request, res: Response) {
        let { id } = req.params
        await this.materialServices.deleteMaterial(Number(id))
        res.status(200).json({ message: `Material with id:${id} successfully deleted` })
    }
}