import "reflect-metadata";
import { DataSource } from "typeorm"
import { User } from "../models/user.model";
import { Category } from "../models/category.model";
import { Course } from "../models/course.model";
import { Payment } from "../models/payment.model";
import { Enrollment } from "../models/enrollment.model";

export const AppDataSource =
    new DataSource({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "lms",
        entities: [User,Category,Course,Payment,Enrollment],
        migrations:["src/migrations"],
        synchronize: true,
        logging: true,
    });
class DBconnection {

    establishConnection() {
        AppDataSource.initialize()
            .then(() => {
                console.log("database connected succesfully");

            }).catch((err) => {
                console.log('Unable to connect to the database:', err);

            })
    }

}

export default DBconnection