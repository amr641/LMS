import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import { allowedTo } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";

export const paymentRouter = Router()
const paymnetController = new PaymentController()
paymentRouter
    // .use(verifyToken)

    .get("/", paymnetController.getAllPayments.bind(paymnetController))
    .post("/", paymnetController.createPayment.bind(paymnetController))
    .get("/success/:userId", paymnetController.handelSuccess.bind(paymnetController))

    .route("/:id")

    .get(paymnetController.getPayment.bind(paymnetController))
    .patch(paymnetController.updatePayment.bind(paymnetController))
    .delete(paymnetController.deletePayment.bind(paymnetController))