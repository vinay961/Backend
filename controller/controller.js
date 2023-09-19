const userSchema = require('../model/userModel');
const User = new userSchema()
const bcrypt = require('bcrypt')
const crypto = require('crypto')

exports.signUp = async(req,res)=>{
    try {
        const {name,email,password,confirmPassword} = req.body;

        if(!name || !email || !password || !confirmPassword){
            throw new Error("Some field is Empty.")
        }
        const userExist =await userSchema.findOne({email});
        if(userExist){
            throw new Error("User email is already registered.")
        }
        if(password!=confirmPassword){
            throw new Error("Password and Confirm Password will not be matched.")
        }

        const User = await userSchema.create({
            name,
            email,
            password,
            confirmPassword
        })

        res.status(201).json({
            success:true,
            User
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.signIn = async (req, res,next) => {
    const {email,password} = req.body
    console.log(email,password)
    if(!email || !password){
        throw new Error("Email or Password is not entered.")
    }

    try {
        const User = await userSchema
            .findOne({email})
            .select("+password");
        
        if(!User || !(await bcrypt.compare(password,User.password))){
            throw new Error("Invalid credential's")
        }

        // creating JWT Token
        const token = User.generateJwtToken()
        userSchema.password=undefined

        const cookieOption={
            maxAge:24*60*60*1000,
            httpOnly:true
        };

        res.cookie("token",token,cookieOption);


        res.status(201).json({
            success: true,
            message: "Successfully signed in",
        });
    
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.userInfo = async (req,res) =>{
    const id = req.user.id

    try {
        const member = await userSchema.findById(id);
        return res.status(201).json({
            success:true,
            member
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.logout = async (req,res,next) =>{
    try {
        const cookieOption = {
            expire : new Date(),
            httpOnly:true
        }
        res.cookie("token",null,cookieOption);
        res.status(201).json({
            success:true,
            message:"Logout Sucessful"
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.forgotPassword = async(req,res) =>{
    try {
        const email = req.body.email;

        if(!email){
            res.status(400).json({
                success:false,
                message:"Email is Required in ordered to Reset Password"
            })
        }
        const valid = await userSchema.findOne({email})
        if(!valid){
            res.status(400).json({
                success:false,
                message:"User is not found in our database."
            })
        }
        const forgotPasswordToken = User.getForgetPasswordToken();
        await valid.save();
        res.status(200).json({
            success:true,
            token:forgotPasswordToken
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.resetPassword = async(req,res) =>{
    const token  = req.params.token;
    const {password,confirmPassword} = req.body;

    if(!password && !confirmPassword){
        res.status(400).json({
            success:false,
            message:"password and confirmPassword is required"
        })
    }
    if(password!=confirmPassword){
        res.status(400).json({
            success:false,
            message:"Both password and confirmPassword must be equal"
        })
    }
    try {
        const hashToken = crypto.createHash("sha256").update(token).digest("hex");

        const valid = await userSchema.findOne({
            forgotPasswordToken:hashToken,
            forgotPasswordExpiryDate:{
                $gt : new Date()
            }
        });
    
        if(!valid){
            res.status(400).json({
                success:false,
                message:"Invalid Token or token is expired"
            })
        }
        valid.password = password;
        await valid.save();
    
        valid.forgotPasswordToken = undefined;
        valid.forgotPasswordExpiryDate = undefined;
        valid.password = undefined
    
        res.status(200).json({
            success:true,
            valid
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
