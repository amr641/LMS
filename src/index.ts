import "reflect-metadata";
import express from 'express';
import dbConnection from "./config/dbConfig";
const app = express();
const port = 3000;
import { bootstrab } from './bootstrab';
import "dotenv/config"


app.use(express.json());
(new dbConnection()).establishConnection()
bootstrab(app) 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))