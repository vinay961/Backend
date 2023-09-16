const express = require("express")

const cors = require('cors')
const app = express()
const cookieParser = require("cookie-parser")


// Database Connection
const connectDatabase = require('./config/dbconfig.js')
connectDatabase();

// MiddleWare
app.use(express.json())
app.use(cookieParser())


// Setting Router
const userRoute = require('./router/userRoute.js');
app.use('/api',userRoute)

app.use('/',(req,res) =>{
    res.status(201).json({
        data:"JWT-Server"
    })
});

module.exports = app