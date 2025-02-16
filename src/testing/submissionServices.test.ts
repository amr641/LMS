import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import { CloudUploader } from "../utils/cloudinary.utils";
import { AppError } from "../utils/appError";
import { Assignment } from "../models/assignments.model";
import { SubmissionServices } from "../services/submission.service";
import { Submission } from "../models/submission.model";
import { SubmissionDTO } from "../interfaces/submission.INTF";

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

describe("SubmissionServices", () => {
    let submissionServices: SubmissionServices;
    let mockRepo: jest.Mocked<Repository<Submission>>;
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
        } as unknown as jest.Mocked<Repository<Submission>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        mockUploader = new CloudUploader() as jest.Mocked<CloudUploader>;

        // Inject the mockUploader into MaterialServices
        submissionServices = new SubmissionServices(mockRepo, mockUploader); // <-- Key change
    });

    describe("submitAssignment", () => {
        it("should submit a new assignment", async () => {
            const assignmentData: SubmissionDTO = {
                student: 1,
                file: "https://cloud-storage.com/uploaded_file_url",
                assignment: 2,
                grade: 0,
                submissionDate: new Date()
            };
            const uploadedFileUrl = "https://cloud-storage.com/uploaded_file_url";
            const savedSubmission = Object.assign(new Submission(), { id: 2, ...assignmentData, file: uploadedFileUrl, createdAt: new Date(), updatedAt: new Date() });

            mockUploader.uploadToCloudinary.mockResolvedValue(assignmentData.file || "https://cloud-storage.com/uploaded_file_url");
            mockRepo.create.mockReturnValue(savedSubmission);
            mockRepo.save.mockResolvedValue(savedSubmission);

            const result = await submissionServices.submitAssignment(assignmentData);

            // Ensure uploadToCloudinary is called with the buffer
            expect(mockUploader.uploadToCloudinary).toHaveBeenCalledWith(uploadedFileUrl);

            // Ensure repository methods are called correctly
            expect(mockRepo.create).toHaveBeenCalledWith({ ...assignmentData, file: uploadedFileUrl });
            expect(mockRepo.save).toHaveBeenCalledWith(savedSubmission);
            expect(result).toEqual(savedSubmission);
        });

        it("should throw an error if no file is provided", async () => {
            await expect(submissionServices.submitAssignment({} as SubmissionDTO)).rejects.toThrow("No Files Provided");
        });
    });

    describe("getSubmission", () => {
        it("should return a material by ID", async () => {
            const submission = Object.assign(new Assignment(), {
                file: "https://cloud-storage.com/uploaded_file_url",
                student: 2,
                submissionDate: new Date(),
                assignment: 2,
                grade: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            mockRepo.findOne.mockResolvedValue(submission);

            const result = await submissionServices.getSubmission(1);
            expect(result).toEqual(submission);
        });

        it("should throw an error if submission not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            await expect(submissionServices.getSubmission(1)).rejects.toThrow("Submission Not Found");
        });
    });

    describe("getAllSubmissions", () => {
        it("should return all submissions", async () => {
            const submissions = [mockRepo.create({
                id: 4,
                file: "https://cloud-storage.com/uploaded_file_url",
                student: 2,
                submissionDate: new Date(),
                assignment: 2,
                grade: 0
            })];
            mockRepo.find.mockResolvedValue(submissions);

            const result = await submissionServices.getAllSubmissions();
            expect(result).toEqual(submissions);
        });

        it("should throw an error if no submissions exist", async () => {
            mockRepo.find.mockResolvedValue([]);
            await expect(submissionServices.getAllSubmissions()).rejects.toThrow("No Submissions Provided");
        });
    });

    describe("updateAssignment", () => {
        it("should update Submission with new file", async () => {
            const existingSubmission = Object.assign(new Assignment(), {
                id: 4,
                file: "old_url",
                student: 2,
                submissionDate: new Date(),
                assignment: 2,
                grade: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const assignmentData: SubmissionDTO = { file: "new_file_path", grade: 8 };

            jest.spyOn(submissionServices, "getSubmission").mockResolvedValue(existingSubmission);
            mockUploader.removeOldFile.mockResolvedValue();
            mockUploader.uploadToCloudinary.mockResolvedValue("new_uploaded_url");

            const updatedSubmission = Object.assign(new Assignment(), {
                ...existingSubmission,
                ...assignmentData,
                file: "new_uploaded_url",
            });

            mockRepo.save.mockResolvedValue(updatedSubmission);

            const result = await submissionServices.updateSubmission(1, assignmentData);

            expect(mockUploader.removeOldFile).toHaveBeenCalledWith("old_url");
            expect(mockUploader.uploadToCloudinary).toHaveBeenCalledWith("new_file_path");
            expect(mockRepo.save).toHaveBeenCalledWith(updatedSubmission);
            expect(result).toEqual(updatedSubmission);
        });
    });

    describe("deleteSubmission", () => {
        it("should delete a submission", async () => {
            const submission = {
                id: 4,
                file: "https://cloud-storage.com/uploaded_file_url",
                student: 2,
                submissionDate: new Date(),
                assignment: 2,
                grade: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            jest.spyOn(submissionServices, "getSubmission").mockResolvedValue(submission);
            mockUploader.removeOldFile.mockResolvedValue();
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

            await submissionServices.deleteSubmission(4);

            expect(mockUploader.removeOldFile).toHaveBeenCalledWith("https://cloud-storage.com/uploaded_file_url");
            expect(mockRepo.delete).toHaveBeenCalledWith(4);
        });
    });
    describe("getAssignmentSubmissions", () => {
    
        it("should return submissions for a given assignment", async () => {
            const mockSubmissions = [
                { id: 1, student: 1, file: "file1.pdf", assignment: 2, submissionDate: new Date() },
                { id: 2, student: 2, file: "file2.pdf", assignment: 2, submissionDate: new Date() }
            ];
    
            (mockRepo.createQueryBuilder as jest.Mock).mockReturnValue({
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(mockSubmissions),
            });
    
            const result = await submissionServices.getAssignmentSubmissions(2);
            expect(result).toEqual(mockSubmissions);
        });
    
        it("should throw an error if no submissions exist for the assignment", async () => {
            (mockRepo.createQueryBuilder as jest.Mock).mockReturnValue({
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue([]),
            });
    
            await expect(submissionServices.getAssignmentSubmissions(2))
                .rejects.toThrow(new AppError("No Submissions Provided For This Assignment", 404));
        });
    });
});
