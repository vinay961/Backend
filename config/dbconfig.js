require("dotenv").config();
const mongoose = require("mongoose")
const DB_URI = process.env.DB_URI;

const connectDatabase = () =>{
    mongoose.connect(DB_URI)
    const db = mongoose.connection;

    db.on('error',()=>{
        console.log("Error while connecting to Database.");
    })
    db.once('open',()=>{
        console.log("Succesfully connected to Database.");
    })
}

module.exports = connectDatabase;
