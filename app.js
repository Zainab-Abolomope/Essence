const cookieParser = require("cookie-parser")
const express = require("express")
const app = express()
const exphbs = require("express-handlebars")
const expressFileupload = require("express-fileupload")
const mongoose = require("mongoose")
require("dotenv").config()
const main = require("./routes/mainRoute")

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB connected successfully")
}).catch((err)=>{
    console.log(err.message)
})

app.engine("hbs", exphbs.engine({
    defaultLayout:"main",
    extname:".hbs",
    runtimeOptions:{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}))

app.use(cookieParser())
app.use(expressFileupload())
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use("/", main)

app.set("view engine", "hbs")




const port = process.env.PORT

app.listen(port, ()=>{
    console.log("Server listening on port " + port)
})