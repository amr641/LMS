import { Repository } from "typeorm";
import { Material } from "../models/materials.mode";
import { AppDataSource } from "../config/dbConfig";
import { IMaterial, MaterialDTO } from "../interfaces/materials.INTF";
import { CloudUploader } from "../utils/cloudinary.utils";
import { AppError } from "../utils/appError";

export class MaterialServices {
    private readonly materialRepo: Repository<Material>
    private uploader: CloudUploader
    constructor() {
        this.materialRepo = AppDataSource.getRepository(Material)
        this.uploader = new CloudUploader()
    }
    async addMaterial(materialData: MaterialDTO) {
        if (!materialData.file) throw new AppError("no files provided", 400)
        materialData.file = await this.uploader.uploadToCloudinary(materialData.file)
        let material = this.materialRepo.create(materialData)
        await this.materialRepo.save(material);
        return material

    }
    async getMaterial(id: number) {
        let material: IMaterial | null = await this.materialRepo.findOne({ where: { id } })
        if (!material) throw new AppError("material not found", 404)
        return material
    }
    async allMaterials() {
        let materials: IMaterial[] | [] = await this.materialRepo.find()
        if (!materials.length) throw new AppError("Out Of Materials", 404)
        return materials
    }
    async CourseMaterials(course: number) {

        let materials: IMaterial[] | [] = await this.materialRepo.createQueryBuilder("material")
            .innerJoin("material.course", "course")
            .where("course.id = :course", { course })
            .getMany();

        if (!materials.length) throw new AppError("No Provided Materials For This Course", 404);
        return materials
    }
    async updateMaterials(materialData: MaterialDTO, id: number) {
        let material = await this.getMaterial(id)
        if (materialData.file) {
            await this.uploader.removeOldFile(material.file) // remove the old file
            materialData.file = await this.uploader.uploadToCloudinary(materialData.file)
        }
        Object.assign(material, materialData)
        material = await this.materialRepo.save(material)
        return material
    }
    async deleteMaterial(id: number) {
        let material = await this.getMaterial(id)
        await this.uploader.removeOldFile(material.file)
        await this.materialRepo.delete(id)
    }

}