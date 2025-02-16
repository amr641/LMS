import { Repository } from "typeorm";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/user.INTF";
import { AppDataSource } from "../config/dbConfig";
import { AppError } from "../utils/appError";
import { Roles } from "../enums/roles.enum";
import { User } from "../models/user.model";

jest.mock("../config/dbConfig", () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

describe("UserService", () => {
    let userService: UserService;
    let mockRepo: jest.Mocked<Repository<User>>;

    beforeEach(() => {
        mockRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create:jest.fn()
        } as unknown as jest.Mocked<Repository<User>>;

        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
        userService = new UserService(mockRepo);
    });

    describe("getAllUsers", () => {
        it("should return a list of users", async () => {
            const mockUsers = [
               mockRepo.create({ name: "Amr", email: "amr@example.com", phone: 123456789, role: "admin" as Roles }),
            ];

            mockRepo.find.mockResolvedValue(mockUsers);
            const users = await userService.getAllUsers();

            expect(users).toEqual(mockUsers);
            expect(mockRepo.find).toHaveBeenCalledWith({
                select: ["name", "email", "phone", "role"],
            });
        });

        it("should throw an error when no users are found", async () => {
            mockRepo.find.mockResolvedValue([]);

            await expect(userService.getAllUsers()).rejects.toThrow(AppError);
            await expect(userService.getAllUsers()).rejects.toThrow("Out Of Users");
            expect(mockRepo.find).toHaveBeenCalled();
        });
    });

    describe("getUser", () => {
        it("should return a user by ID", async () => {
            const mockUser =Object.assign(new User(),{id:1, name: "Amr", email: "amr@example.com", phone: 123456789, role: "admin" as Roles });
            mockRepo.findOne.mockResolvedValue(mockUser);
            const user = await userService.getUser(1);

            expect(user).toEqual(mockUser);
            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, select: ["name", "email", "phone", "role"] });
        });

        it("should throw an error if the user is not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(userService.getUser(1)).rejects.toThrow(AppError);
            await expect(userService.getUser(1)).rejects.toThrow("User Not Found");
        });
    });
    describe("updateUser", () => {
        it("should successfully update a user's information", async () => {
            const mockUserEntity = Object.assign(new User(), {
                id: 1,
                name: "Old Name",
                email: "old@example.com",
                phone: 123456789,
                role: Roles.STUDENT,
                DOB:new Date( "4-3-2003")
            });

            const updatedUserData = {
                id: 1,
                name: "Updated Name",
                email: "updated@example.com",
                phone: 987654321,
                role: Roles.ADMIN,
                DOB: new Date("4-3-2003")

            };

            mockRepo.findOne.mockResolvedValue(mockUserEntity);
            mockRepo.save.mockResolvedValue(Object.assign(mockUserEntity, updatedUserData));

            const updatedUser = await userService.updateUser(updatedUserData);

            expect(updatedUser).toEqual(updatedUserData);
            expect(mockRepo.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                select: ["name", "email", "phone", "role"],
            });
            expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining(updatedUserData));
        });

        it("should throw an error when the user to be updated is not found", async () => {
            mockRepo.findOne.mockResolvedValue(null);

            await expect(userService.updateUser({
                id: 999,
                name: "",
                email: "",
                role: Roles.STUDENT,
                DOB: new Date("3-3-1999"),
                phone: 0
            })).rejects.toThrow(AppError);
            await expect(userService.updateUser({
                id: 999,
                name: "",
                email: "",
                role: Roles.STUDENT,
                DOB: new Date("3-3-1999"),
                phone: 0
            })).rejects.toThrow("User Not Found");

            expect(mockRepo.findOne).toHaveBeenCalledWith({
                where: { id: 999 },
                select: ["name", "email", "phone", "role"],
            });
        });

    })

    it("should throw an error when the user to be updated is not found", async () => {
        mockRepo.findOne.mockResolvedValue(null);
    
        await expect(
            userService.updateUser({
                id: 999,
                name: "",
                email: "",
                role: Roles.STUDENT,
                DOB: new Date("1-2-1999"),
                phone: 0
            })
        ).rejects.toThrow(AppError);
        
        await expect(
            userService.updateUser({
                id: 999,
                name: "",
                email: "",
                role: Roles.STUDENT,
                DOB: new Date("1-2-1999"),
                phone: 0
            })
        ).rejects.toThrow("User Not Found");
    
        // Corrected expectation for the findOne call with select and where clause
        expect(mockRepo.findOne).toHaveBeenCalledWith({
            where: { id: 999 },
            select: ["name", "email", "phone", "role"],
        });
    });

    describe("deleteUser", () => {
        it("should throw an error if the user is not found", async () => {
            mockRepo.delete.mockResolvedValue({ affected: 0 });

            await expect(userService.deleteUser(1)).rejects.toThrow(AppError);
            await expect(userService.deleteUser(1)).rejects.toThrow("User Not Found");
        });
    });
});
