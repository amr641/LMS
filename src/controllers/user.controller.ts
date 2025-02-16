import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AppDataSource } from "../config/dbConfig";
import { User } from "../models/user.model";
let message = "success"
export class UserController {
    private readonly userServices: UserService
    constructor() {
        this.userServices = new UserService(AppDataSource.getRepository(User))
    }
    async getAllUsers(req: Request, res: Response) {
        let users = await this.userServices.getAllUsers()
        res.status(200).json({ message, users })
    }
    async getUser(req: Request, res: Response) {
        let { id } = req.params
        let user = await this.userServices.getUser(Number(id))
        res.status(200).json({ message, user })
    }
    async editUser(req: Request, res: Response) {
        let { id } = req.params;
        let user = await this.userServices.updateUser({
            id: Number(id),
            ...req.body
        })
        res.status(201).json({ message, user })
    }
    async deleteUser(req: Request, res: Response) {
        let { id } = req.params;
        await this.userServices.deleteUser(Number(id))
        res.status(200).json({ message: `User With Id : ${id} deleted successfully` })
    }
}