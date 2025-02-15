import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import { CloudUploader } from "../utils/cloudinary.utils";
import { AssignmentServices } from "../services/assignment.service";
import { Assignment } from "../models/assignments.model";
import { AssignmentDTO } from "../interfaces/assignment.INTF";

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

describe("AssignmentServices", () => {
    let assignmentServices: AssignmentServices;
    let mockRepo: jest.Mocked<Repository<Assignment>>;
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
        } as unknown as jest.Mocked<Repository<Assignment>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        mockUploader = new CloudUploader() as jest.Mocked<CloudUploader>;

        // Inject the mockUploader into MaterialServices
        assignmentServices = new AssignmentServices(mockRepo, mockUploader); // <-- Key change
    });

    describe("addAssignment", () => {
        it("should add a new assignment", async () => {
            // Simulating file as Buffer
            const assignmentData: AssignmentDTO = { description: "https://cloud-storage.com/uploaded_file_url", course: 1, title: "Material 1",dueDate:new Date() };
            const uploadedFileUrl = "https://cloud-storage.com/uploaded_file_url";
            const savedMaterial = Object.assign(new Assignment(), { id: 1, ...assignmentData, description: uploadedFileUrl, createdAt: new Date(), updatedAt: new Date() });

            mockUploader.uploadToCloudinary.mockResolvedValue("https://cloud-storage.com/uploaded_file_url");
            mockRepo.create.mockReturnValue(savedMaterial);
            mockRepo.save.mockResolvedValue(savedMaterial);

            const result = await assignmentServices.addAssignment(assignmentData);

            // Ensure uploadToCloudinary is called with the buffer
            expect(mockUploader.uploadToCloudinary).toHaveBeenCalledWith(uploadedFileUrl);

            // Ensure repository methods are called correctly
            expect(mockRepo.create).toHaveBeenCalledWith({ ...assignmentData, description: uploadedFileUrl });
            expect(mockRepo.save).toHaveBeenCalledWith(savedMaterial);
            expect(result).toEqual(savedMaterial);
        });

        it("should throw an error if no file is provided", async () => {
            await expect(assignmentServices.addAssignment({} as AssignmentDTO)).rejects.toThrow("No Files Provided");
        });
    });

    describe("getAssignment", () => {
        it("should return a material by ID", async () => {
            const assignment = Object.assign(new Assignment(), {
                id: 1,
                title: "string",
                description: "string",
                course: 2,
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            mockRepo.findOne.mockResolvedValue(assignment);

            const result = await assignmentServices.getAssignment(1);
            expect(result).toEqual(assignment);
        });

        it("should throw an error if assignment not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            await expect(assignmentServices.getAssignment(1)).rejects.toThrow("Assignment Not Found");
        });
    });

    describe("allAssignment", () => {
        it("should return all assignments", async () => {
            const assignments = [mockRepo.create({
                id: 1,
                title: "string",
                description: "string",
                course: 2,
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            })];
            mockRepo.find.mockResolvedValue(assignments);

            const result = await assignmentServices.getAllAssignments();
            expect(result).toEqual(assignments);
        });

        it("should throw an error if no assignments exist", async () => {
            mockRepo.find.mockResolvedValue([]);
            await expect(assignmentServices.getAllAssignments()).rejects.toThrow( "No Assignments Provided");
        });
    });

    describe("updateAssignment", () => {
        it("should update Assignment with new file", async () => {
            const existingAssignment = Object.assign(new Assignment(), {
                title: "string",
                description: "old_url",
                course: 2,
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const assignmentData: AssignmentDTO = { description: "new_file_path", title: "Updated Material" };

            jest.spyOn(assignmentServices, "getAssignment").mockResolvedValue(existingAssignment);
            mockUploader.removeOldFile.mockResolvedValue();
            mockUploader.uploadToCloudinary.mockResolvedValue("new_uploaded_url");

            const updatedAssignment = Object.assign(new Assignment(), {
                ...existingAssignment,
                ...assignmentData,
                description: "new_uploaded_url",
            });

            mockRepo.save.mockResolvedValue(updatedAssignment);

            const result = await assignmentServices.updateAssignment(1, assignmentData);

            expect(mockUploader.removeOldFile).toHaveBeenCalledWith("old_url");
            expect(mockUploader.uploadToCloudinary).toHaveBeenCalledWith("new_file_path");
            expect(mockRepo.save).toHaveBeenCalledWith(updatedAssignment);
            expect(result).toEqual(updatedAssignment);
        });
    });

    describe("deleteAssignment", () => {
        it("should delete a material", async () => {
            const assignment = { id: 1,  title: "string",
                description:"https://cloud-storage.com/uploaded_file_url",
                course: 2,
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),};

            jest.spyOn(assignmentServices, "getAssignment").mockResolvedValue(assignment);
            mockUploader.removeOldFile.mockResolvedValue();
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

            await assignmentServices.deleteAssignment(1);

            expect(mockUploader.removeOldFile).toHaveBeenCalledWith("https://cloud-storage.com/uploaded_file_url");
            expect(mockRepo.delete).toHaveBeenCalledWith(1);
        });
    });
});
