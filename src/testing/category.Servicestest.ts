import { Repository } from "typeorm";
import { AppDataSource } from "../config/dbConfig";
import { AppError } from "../utils/appError";
import { CategoryService } from "../services/category.service";
import { CategoryDto, ICategory } from "../interfaces/category.INTF";
import { CourseCategory } from "../enums/category.names";

jest.mock("../config/dbConfig", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

describe("CategoryServices", () => {
    let categoryServices: CategoryService;
    let mockRepo: jest.Mocked<Repository<ICategory>>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<Repository<ICategory>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        categoryServices = new CategoryService();
    });

    describe("getAllCategories", () => {
        it("should return a list of categories", async () => {
            const mockCategories = [
                {
                    id: 1,
                    name: CourseCategory.CloudComputing,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ];

            mockRepo.find.mockResolvedValue(mockCategories);
            const categories = await categoryServices.getAllCategoris();

            expect(categories).toEqual(mockCategories);
            expect(mockRepo.find).toHaveBeenCalledWith();
        });

        it("should throw an error when no users are found", async () => {
            mockRepo.find.mockResolvedValue([]);

            await expect(categoryServices.getAllCategoris()).rejects.toThrow(AppError);
            await expect(categoryServices.getAllCategoris()).rejects.toThrow("Out Of categories");
            expect(mockRepo.find).toHaveBeenCalled();
        });
    });

    describe("getCategory", () => {
        it("should return a category by ID", async () => {
            const mockCategory = {
                id: 1,
                name: CourseCategory.CloudComputing,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            mockRepo.findOne.mockResolvedValue(mockCategory);
            const user = await categoryServices.getCategory(1);

            expect(user).toEqual(mockCategory);
            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it("should throw an error if the category is not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(categoryServices.getCategory(1)).rejects.toThrow(AppError);
            await expect(categoryServices.getCategory(1)).rejects.toThrow("Category Not Found");
        });
    });
    describe("createCategory", () => {
        it('should create and save a category', async () => {
            const categoryData: CategoryDto = { name: CourseCategory.CloudComputing, description: "description" };
            const createdCategory = { id: 1, ...categoryData, createdAt: new Date(), updatedAt: new Date() };

            mockRepo.create.mockReturnValue(createdCategory);
            mockRepo.save.mockResolvedValue(createdCategory);

            const result = await categoryServices.createCategory(categoryData);

            expect(mockRepo.create).toHaveBeenCalledWith(categoryData);
            expect(mockRepo.save).toHaveBeenCalledWith(createdCategory);
            expect(result).toEqual(createdCategory);
        });
    })
    describe('deleteCategory', () => {
        it('should throw an error if category is not found', async () => {
            const categoryId = 1;

            // Mock getCategory to throw an error when category is not found
            jest.spyOn(categoryServices, 'getCategory').mockRejectedValue(new Error('Category not found'));

            await expect(categoryServices.deletecategory(categoryId)).rejects.toThrow('Category not found');

            expect(mockRepo.delete).not.toHaveBeenCalled(); // Ensure delete is not called
        });

        it('should delete the category if it exists', async () => {
            const categoryId = 1;
            const mockCategory = { id: categoryId, name: CourseCategory.CloudComputing, createdAt: new Date(), updatedAt: new Date() };

            jest.spyOn(categoryServices, 'getCategory').mockResolvedValue(mockCategory);
            mockRepo.delete.mockResolvedValue({ affected: 1 } as any); // Simulate deletion

            await categoryServices.deletecategory(categoryId);

            expect(mockRepo.delete).toHaveBeenCalledWith(categoryId);
        });
    });
    describe('updateCategory', () => {
        it('should throw an error if no ID is provided', async () => {
            const categoryData = { name: 'New Category', description: 'Updated description' };
    
            await expect(categoryServices.updateCategory(categoryData as any))
                .rejects.toThrow('Please Provide the Required Data');
        });
    
        it('should throw an error if category is not found', async () => {
            const categoryData = { id: 1, name: CourseCategory.CloudComputing, description: 'Updated description' };
    
            // Mock getCategory to reject with "Category not found"
            jest.spyOn(categoryServices, 'getCategory').mockRejectedValue(new Error('Category not found'));
    
            await expect(categoryServices.updateCategory(categoryData))
                .rejects.toThrow('Category not found');
    
            expect(mockRepo.save).not.toHaveBeenCalled(); // Ensure save is not called
        });
    
        it('should update the category successfully', async () => {
            const categoryData = { id: 1, name: CourseCategory.CloudComputing, description: 'Updated description' };
            const existingCategory = { id: 1, name:CourseCategory.DataScience, description: 'Old description'};
    
            jest.spyOn(categoryServices, 'getCategory').mockResolvedValue(existingCategory);
            mockRepo.save.mockResolvedValue({ ...existingCategory, ...categoryData });
    
            const result = await categoryServices.updateCategory(categoryData);
    
            expect(mockRepo.save).toHaveBeenCalledWith({
                id: 1,
                name: CourseCategory.CloudComputing,
                description: 'Updated description',
            });
    
            expect(result).toEqual({
                id: 1,
                name: CourseCategory.CloudComputing,
                description: 'Updated description',
            });
        });
    });

});
