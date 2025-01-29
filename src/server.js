const dotenv = require("dotenv") 
dotenv.config() 

const express = require("express")
const cors = require("cors")
const cookieParser  = require("cookie-parser")

const connectDb  = require("./db/database")

const Auth = require("./routes/Auth")
const Category = require("./routes/Category")


const main = async () => {
    const app = express() 
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors())

    connectDb()

    app.use("/api/v1/auth", Auth)
    app.use("/api/v1/category", Category)

    const port = process.env.port 
    const server = app.listen(port, () => {
        console.log(`server running on localhost:${port}`)
    })
}

main().catch(error => {
    console.log(error)
})