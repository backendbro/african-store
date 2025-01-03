import dotenv from "dotenv"
dotenv.config() 

import express from "express"
import cors from "cors"
import { connectDb } from "./db.ts/database"
import cookieParser from "cookie-parser"


import Auth from "./routes/Auth"

const main = async () => {
    const app = express() 
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors())

    connectDb()


    app.use("/api/v1/auth", Auth)

    const port = process.env.port 
    const server = app.listen(port, () => {
        console.log(`server running on localhost:${port}`)
    })
}

main().catch(error => {
    console.log(error)
})