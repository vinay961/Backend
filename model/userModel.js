require('dotenv').config();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'Name Field is mandatory'],
        trim:true
    },
    email:{
        type:String,
        require:[true,'Email is mandatory'],
        unique:[true,'User already exist'],
        lowercase:true
    },
    password:{
        type:String,
        select:false,

        // used to store a token for resetting the user's password"
        forgetPasswordtoken:{type:String},
        // used to store the expiry date of reset password token
        forgetPasswordExpiryDate:{type: Date }
    }
},{timestamps:true});

// we made a function that triggred when we save something
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

UserSchema.methods.generateJwtToken = function() {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.SECRET,
        { expiresIn: 24 * 60 * 60 } // Expiration time in seconds (24 hours)
    );
};

const user = mongoose.model("LoginUser",UserSchema);
module.exports = user;