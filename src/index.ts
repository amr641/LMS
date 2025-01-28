import "reflect-metadata"
import express from 'express'
import dbConnection from "./config/dbConfig"
const app = express()
const port = 3000
import { bootstrab } from './bootstrab'
app.use(express.json())
let database = new dbConnection()
database.establishConnection()
bootstrab(app) 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))