import { Repository } from "typeorm";
import { Material } from "../models/materials.mode";
import { AppDataSource } from "../config/dbConfig";
import { IMaterial, MaterialDTO } from "../interfaces/materials.INTF";
import { CloudUploader } from "../utils/cloudinary.utils";
import { AppError } from "../utils/appError";
import { MaterialServices } from "../services/materials.service";

jest.mock("../config/dbConfig", () => ({
    AppDataSource: {
        getRepository: jest.fn()
    }
}));

jest.mock("../utils/cloudinary.utils", () => {
    return {
        CloudUploader: jest.fn().mockImplementation(() => {
            return {
                uploadToCloudinary: jest.fn().mockResolvedValue("uploaded_url"),
                removeOldFile: jest.fn().mockResolvedValue(true)
            };
        })
    };
});

describe("MaterialServices", () => {
    let materialService: MaterialServices;
    let mockRepo: jest.Mocked<Repository<Material>>;
    let mockUploader: jest.Mocked<CloudUploader>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn()
            })
        } as unknown as jest.Mocked<Repository<Material>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        mockUploader = new CloudUploader() as jest.Mocked<CloudUploader>;

        // Inject the mockUploader into MaterialServices
        materialService = new MaterialServices(mockRepo, mockUploader); // <-- Key change
    });

    describe("addMaterial", () => {
        it("should add a new material", async () => {
            // Simulating file as Buffer
            const materialData: MaterialDTO = { file:"https://cloud-storage.com/uploaded_file_url", course: 1, title: "Material 1" };
            const uploadedFileUrl ="https://cloud-storage.com/uploaded_file_url";
            const savedMaterial = Object.assign(new Material(), { id: 1, ...materialData, file: uploadedFileUrl, createdAt: new Date(), updatedAt: new Date() });

            mockUploader.uploadToCloudinary.mockResolvedValue("https://cloud-storage.com/uploaded_file_url");
            mockRepo.create.mockReturnValue(savedMaterial);
            mockRepo.save.mockResolvedValue(savedMaterial);

            const result = await materialService.addMaterial(materialData);

            // Ensure uploadToCloudinary is called with the buffer
            expect(mockUploader.uploadToCloudinary).toHaveBeenCalledWith(uploadedFileUrl);

            // Ensure repository methods are called correctly
            expect(mockRepo.create).toHaveBeenCalledWith({ ...materialData, file: uploadedFileUrl });
            expect(mockRepo.save).toHaveBeenCalledWith(savedMaterial);
            expect(result).toEqual(savedMaterial);
        });

        it("should throw an error if no file is provided", async () => {
            await expect(materialService.addMaterial({} as MaterialDTO)).rejects.toThrow("no files provided");
        });
    });

    describe("getMaterial", () => {
        it("should return a material by ID", async () => {
            const material =Object.assign(new Material(),{ id: 1, title: "title", file: "uploaded_url", createdAt: new Date(), updatedAt: new Date() });
            mockRepo.findOne.mockResolvedValue(material);

            const result = await materialService.getMaterial(1);
            expect(result).toEqual(material);
        });

        it("should throw an error if material not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            await expect(materialService.getMaterial(1)).rejects.toThrow("Material Not Found");
        });
    });

    describe("allMaterials", () => {
        it("should return all materials", async () => {
            const materials = [mockRepo.create({ id: 1, title: "title", file: "uploaded_url", createdAt: new Date(), updatedAt: new Date() })];
            mockRepo.find.mockResolvedValue(materials);

            const result = await materialService.allMaterials();
            expect(result).toEqual(materials);
        });

        it("should throw an error if no materials exist", async () => {
            mockRepo.find.mockResolvedValue([]);
            await expect(materialService.allMaterials()).rejects.toThrow("Out Of Materials");
        });
    });

    describe("updateMaterials", () => {
        it("should update material with new file", async () => {
            const existingMaterial = Object.assign(new Material(), {
                id: 1,
                title: "title",
                file: "old_url",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const materialData: MaterialDTO = { file: "new_file_path", title: "Updated Material" };

            jest.spyOn(materialService, "getMaterial").mockResolvedValue(existingMaterial);
            mockUploader.removeOldFile.mockResolvedValue();
            mockUploader.uploadToCloudinary.mockResolvedValue("new_uploaded_url");

            const updatedMaterial = Object.assign(new Material(), {
                ...existingMaterial,
                ...materialData,
                file: "new_uploaded_url",
            });

            mockRepo.save.mockResolvedValue(updatedMaterial);

            const result = await materialService.updateMaterials(materialData, 1);

            expect(mockUploader.removeOldFile).toHaveBeenCalledWith("old_url");
            expect(mockUploader.uploadToCloudinary).toHaveBeenCalledWith("new_file_path");
            expect(mockRepo.save).toHaveBeenCalledWith(updatedMaterial);
            expect(result).toEqual(updatedMaterial);
        });
    });

    describe("deleteMaterial", () => {
        it("should delete a material", async () => {
            const material = { id: 1, title: "title", file: "https://cloud-storage.com/uploaded_file_url", createdAt: new Date(), updatedAt: new Date() };

            jest.spyOn(materialService, "getMaterial").mockResolvedValue(material);
            mockUploader.removeOldFile.mockResolvedValue();
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

            await materialService.deleteMaterial(1);

            expect(mockUploader.removeOldFile).toHaveBeenCalledWith("https://cloud-storage.com/uploaded_file_url");
            expect(mockRepo.delete).toHaveBeenCalledWith(1);
        });
    });
});
