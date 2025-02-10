import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { verifyToken } from "../middlewares/verifiyToken";
import { allowedTo } from "../middlewares/authorization";
import { Roles } from "../enums/roles.enum";
import { isPaidBefore } from "../middlewares/validateExistence";

export const paymentRouter = Router()
const paymnetController = new PaymentController()
paymentRouter
    // .use(verifyToken)

    .get("/", paymnetController.getAllPayments.bind(paymnetController))
    .post("/", isPaidBefore, paymnetController.createPayment.bind(paymnetController))
    .get("/success/:userId", paymnetController.handelSuccess.bind(paymnetController))
    .get("/cancel/:userId", paymnetController.handleCanceledPayment.bind(paymnetController))

    .route("/:id")

    .get(paymnetController.getPayment.bind(paymnetController))
    .patch(paymnetController.updatePayment.bind(paymnetController))
    .delete(paymnetController.deletePayment.bind(paymnetController))