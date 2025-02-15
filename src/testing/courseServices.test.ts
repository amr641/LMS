import { Repository } from "typeorm";
import { Course } from "../models/course.model";
import { AppDataSource } from "../config/dbConfig";
import { CourseDTO, ICourse } from "../interfaces/course.INTF";
import { AppError } from "../utils/appError";
import { CourseService } from "../services/course.service";

jest.mock("../config/dbConfig", () => ({
    AppDataSource: {
        getRepository: jest.fn()
    }
}));

describe("CourseService", () => {
    let courseService: CourseService;
    let mockRepo: jest.Mocked<Repository<ICourse>>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<Repository<ICourse>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        courseService = new CourseService();
    });

    describe("createCourse", () => {
        it("should create and save a course", async () => {
            const courseData: CourseDTO = { title: "Test Course", description: "Test Description", instructorId: 1, categoryId: 1, level: "Beginner", price: 100, duration: "4 weeks", startDate: new Date(), endDate: new Date(), isActive: true };
            const savedCourse = { id: 1, ...courseData };

            mockRepo.create.mockReturnValue(savedCourse);
            mockRepo.save.mockResolvedValue(savedCourse);

            const result = await courseService.createCourse(courseData);

            expect(mockRepo.create).toHaveBeenCalledWith(courseData);
            expect(mockRepo.save).toHaveBeenCalledWith(savedCourse);
            expect(result).toEqual(savedCourse);
        });
    });

    describe("getAllCourses", () => {
        it("should return all courses", async () => {
            const courses = [{ id: 1, title: "Course 1" ,level:"beginner",isActive:false}];
            mockRepo.find.mockResolvedValue(courses);

            const result = await courseService.getAllCourses();
            expect(result).toEqual(courses);
        });

        it("should throw an error if no courses exist", async () => {
            mockRepo.find.mockResolvedValue([]);
            await expect(courseService.getAllCourses()).rejects.toThrow("No Courses avilable");
        });
    });

    describe("getCourse", () => {
        it("should return a course by ID", async () => {
            const course = { id: 1, title: "Test Course",level:"beginner",isActive:false };
            mockRepo.findOne.mockResolvedValue(course);

            const result = await courseService.getCourse(1);
            expect(result).toEqual(course);
        });

        it("should throw an error if course not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);
            await expect(courseService.getCourse(1)).rejects.toThrow("course not found");
        });
    });

    describe("updateCourse", () => {
        it("should update a course successfully", async () => {
            const courseData: CourseDTO = { title: "Updated Course", description: "Updated Description", level: "Intermediate", isActive: true };
            const existingCourse = { id: 1, title: "Old Course", description: "Old Description", level: "Beginner", isActive: false };

            jest.spyOn(courseService, "getCourse").mockResolvedValue(existingCourse);
            mockRepo.save.mockResolvedValue({ ...existingCourse, ...courseData });

            const result = await courseService.updateCourse(courseData, 1);

            expect(mockRepo.save).toHaveBeenCalledWith({ ...existingCourse, ...courseData });
            expect(result).toEqual({ ...existingCourse, ...courseData });
        });
    });

    describe("deleteCourse", () => {
        it("should delete a course", async () => {
            const existingCourse = { id: 1, title: "Test Course" , level:"beginner", isActive:false};

            jest.spyOn(courseService, "getCourse").mockResolvedValue(existingCourse);
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

            await courseService.deleteCourse(1);

            expect(mockRepo.delete).toHaveBeenCalledWith(1);
        });
    });

    describe("getCategoryCourses", () => {
        it("should return courses for a category", async () => {
            const courses = [{ id: 1, title: "Test Course" , level:"beginner", isActive:false}];
            mockRepo.find.mockResolvedValue(courses);

            const result = await courseService.getCategoryCourses(1);
            expect(result).toEqual(courses);
        });

        it("should throw an error if no courses exist for a category", async () => {
            mockRepo.find.mockResolvedValue([]);
            await expect(courseService.getCategoryCourses(1)).rejects.toThrow("No Courses avilable");
        });
    });
});
