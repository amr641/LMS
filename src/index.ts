import "reflect-metadata";
import express from 'express';
import { establishConnection } from "./config/dbConfig";
import morgan from "morgan";
import Redis from "ioredis";
import { bootstrab } from './bootstrab';
import "dotenv/config"

export const app = express();
const port = 3000;
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
establishConnection() // db connection

bootstrab(app)
app.listen(port, () => console.log(`Server listening on port ${port}!`))