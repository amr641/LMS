import "reflect-metadata";
import { DataSource } from "typeorm"
import { User } from "../models/user.model";
import { Category } from "../models/category.model";
import { Course } from "../models/course.model";
import { Payment } from "../models/payment.model";
import { Enrollment } from "../models/enrollment.model";
import { Material } from "../models/materials.mode";
import { Assignment } from "../models/assignments.model";
import { Submission } from "../models/submission.model";

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST as string|| "localhost",  // Use environment variable for host
    port: parseInt(process.env.DB_PORT || "3306"),  // Use environment variable for port
    username: process.env.DB_USER as string || "root",  // Use environment variable for username
    password: process.env.DB_PASSWORD || "",  // Use environment variable for password
    database: process.env.DB_NAME as string|| "lms",  // Use environment variable for database name
    entities: [
        User,
        Category,
        Course,
        Payment,
        Enrollment,
        Material,
        Assignment,
        Submission
    ],
    migrations: ["src/migrations"],
    synchronize: false,
    logging: false,
});

   const  establishConnection =()=> {
        AppDataSource.initialize()
            .then(() => {
                console.log("database connected succesfully");

            }).catch((err) => {
                console.log('Unable to connect to the database');

            })
    }



export {establishConnection,AppDataSource} 