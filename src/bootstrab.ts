import { Express } from "express"
import { globalHandeling } from "./middlewares/globalHandeling";
import { authRouter } from "./routes/auth.routes";
import 'dotenv/config'
import { categoryRouter } from "./routes/category.routes";
import { courseRouter } from "./routes/course.routes";
export function bootstrab(app: Express) {
    process.on("uncaughtException", (err: Error) => {
        console.error("Uncaught Exception:", err);
    });
    let baseUrl = "/api/v1";

    app.use(`${baseUrl}/auth`, authRouter)
    app.use(`${baseUrl}/categories`, categoryRouter)
    app.use(`${baseUrl}`, courseRouter)

    // global err handeling midlleware
    app.use(globalHandeling)

    process.on("unhandledRejection", (err: Error) => {
        console.error("Unhandled Rejection:", err);
    });
}