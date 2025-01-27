import express from 'express'
import dbConnection from "./config/dbConfig"
const app = express()
const port = 3000
let database = new dbConnection()
database.establishConnection()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))