import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import { EnrollmentServices } from "../services/enrollment.service";
import { EnrollmentDTO, IEnrollment } from "../interfaces/enrollment.INTF";
import { CourseService } from "../services/course.service";
import { PaymentService } from "../services/payment.service";
import { Enrollment } from "../models/enrollment.model";
import { AppError } from "../utils/appError";

jest.mock("../config/dbConfig", () => ({
    AppDataSource: {
        getRepository: jest.fn()
    }
}));

describe("EnrollmentServices", () => {
    let enrollmentServices: EnrollmentServices;
    let mockRepo: jest.Mocked<Repository<IEnrollment>>;
    let mockCourseService: jest.Mocked<CourseService>;
    let mockPaymentService: jest.Mocked<PaymentService>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<Repository<IEnrollment>>;

        mockCourseService = {
            getCourse: jest.fn(),
        } as unknown as jest.Mocked<CourseService>;

        mockPaymentService = {} as unknown as jest.Mocked<PaymentService>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        enrollmentServices = new EnrollmentServices();
        (enrollmentServices as any).courseServices = mockCourseService;
        (enrollmentServices as any).paymentServices = mockPaymentService;
    });

    describe("createEnrollment", () => {
        it("should create and save an enrollment", async () => {
            const enrollmentData: EnrollmentDTO = { courseId: 1, enrollmentDate: new Date(), student:3};
            const course = { id: 1, title: "Test Course", price: 100 ,level:"beginner", isActive:true};
            const savedEnrollment = { id: 1, ...enrollmentData, courseTitle: course.title, coursePrice: course.price,course:course.id,isActive:false };

            mockCourseService.getCourse.mockResolvedValue(course);
            mockRepo.create.mockReturnValue(savedEnrollment);
            mockRepo.save.mockResolvedValue(savedEnrollment);

            const result = await enrollmentServices.createEnrollment(enrollmentData);

            expect(mockCourseService.getCourse).toHaveBeenCalledWith(enrollmentData.courseId);
            expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
                course: course.id,
                courseTitle: course.title,
                coursePrice: course.price,
                student: enrollmentData.student
            }));
            expect(mockRepo.save).toHaveBeenCalledWith(savedEnrollment);
            expect(result).toEqual(savedEnrollment);
        });
    });

    describe("getEnrollment", () => {
        it("should return an enrollment by ID", async () => {

            const enrollment = { id: 1, student:3, course:2, courseTitle:"title", coursePrice:33.44, isActive:true };
            mockRepo.findOne.mockResolvedValue(enrollment);

            const result = await enrollmentServices.getEnrollment(1);
            expect(result).toEqual(enrollment);
        });

        it("should throw an error if enrollment not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            await expect(enrollmentServices.getEnrollment(1)).rejects.toThrow("enrollment not found");
        });
    });

    describe("getAllEnrollments", () => {
        it("should return all enrollments", async () => {
            const enrollments = [ { id: 1, student:3, course:2, courseTitle:"title", coursePrice:33.44, isActive:true }];
            mockRepo.find.mockResolvedValue(enrollments);

            const result = await enrollmentServices.getAllEnrollments();
            expect(result).toEqual(enrollments);
        });

        it("should throw an error if no enrollments exist", async () => {
            mockRepo.find.mockResolvedValue([]);
            await expect(enrollmentServices.getAllEnrollments()).rejects.toThrow("Out Of Enrollments");
        });
    });

    describe("updateEnrollment", () => {
        it("should update an enrollment successfully", async () => {
            const enrollmentData: EnrollmentDTO = { student: 3,courseId:2 };
            const existingEnrollment = { id: 1, student: 3,course:2, courseTitle:"title", coursePrice:33.44, isActive:true };

            jest.spyOn(enrollmentServices, "getEnrollment").mockResolvedValue(existingEnrollment);
            mockRepo.save.mockResolvedValue({ ...existingEnrollment, ...enrollmentData });

            const result = await enrollmentServices.updateEnrollment(enrollmentData, 1);

            expect(mockRepo.save).toHaveBeenCalledWith({ ...existingEnrollment, ...enrollmentData });
            expect(result).toEqual({ ...existingEnrollment, ...enrollmentData });
        });
    });

    describe("deleteEnrollment", () => {
        it("should delete an enrollment", async () => {
            const existingEnrollment = { id: 1, student: 3,course:2, courseTitle:"title", coursePrice:33.44, isActive:true };

            jest.spyOn(enrollmentServices, "getEnrollment").mockResolvedValue(existingEnrollment);
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

            await enrollmentServices.deleteEnrollment(1);

            expect(mockRepo.delete).toHaveBeenCalledWith(1);
        });
    });
});
