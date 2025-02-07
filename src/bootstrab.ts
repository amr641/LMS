import { Express } from "express"
import { globalHandeling } from "./middlewares/globalHandeling";
import { authRouter } from "./routes/auth.routes";
import { categoryRouter } from "./routes/category.routes";
import { courseRouter } from "./routes/course.routes";
import { userRouter } from "./routes/user.routes";
import { enrollementRouter } from "./routes/enrollment.routes";
import { paymentRouter } from "./routes/payment.routes";
import { materialRouter } from "./routes/material.routes";
import { assignmentRouter } from "./routes/assignment.routes";
import { submissionRouter } from "./routes/submission.routes";
export function bootstrab(app: Express) {
    process.on("uncaughtException", (err: Error) => {
        console.error("Uncaught Exception:", err);
    });
    let baseUrl = "/api/v1";

    app.use(`${baseUrl}/auth`, authRouter)

    app.use(`${baseUrl}/categories`, categoryRouter)

    app.use(`${baseUrl}`, courseRouter)

    app.use(`${baseUrl}/users`, userRouter)

    app.use(`${baseUrl}/enrollments`, enrollementRouter)

    app.use(`${baseUrl}/payments`, paymentRouter)

    app.use(`${baseUrl}/materials`, materialRouter)

    app.use(`${baseUrl}/assignments`,assignmentRouter)
    
    app.use(`${baseUrl}/submissions`,submissionRouter)

    // global err handeling midlleware
    app.use(globalHandeling)

    process.on("unhandledRejection", (err: Error) => {
        console.error("Unhandled Rejection:", err);
    });
}