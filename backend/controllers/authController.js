const { PrismaClient } = require("@prisma/client")
const { ErrorHandler } = require("../middlewares/errorHandling")
const { loginValidate, signupValidate } = require("../middlewares/validate")
const bcrypt=require('bcryptjs')
const generateToken = require("../utils/generateToken")


const prisma=new PrismaClient()


const login=async(req,res)=>{
    try {
        const{email,password}=req.body
        loginValidate(req,next)

        const verifyUser=await prisma.user.findFirstOrThrow({
            where:{email}
        })
        if(verifyUser.email){
            const verifyPass=await bcrypt.compare(password,verifyUser.password)
            const token=generateToken()
            if(verifyPass){
                res.cookie('chattoken',token)
                res.json(200).json({
                    success:true,
                    // message:
                })
            }
        }
        
    } 
    catch (error) {
        next(new ErrorHandler(error.message,400))
    }
}
const logout=async(req,res)=>{
    try {
        const{email,password}=req.body
        
    } 
    catch (error) {
        next(new ErrorHandler(error.message, 400));
        
    }
}
const signup=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        signupValidate(req,next)

        const checkUser=await prisma.user.findFirst({where:[email]})
        if(checkUser.id){
            return next(new ErrorHandler('User already exists', 400));
        }
        const hashedPass=await bcrypt.hash(password,10)
        const newUser=await prisma.user.create({name,email,password:hashedPass})
        if(newUser.id){
            res.status(200).json({
                success:true,
                data:newUser
            })
        }
        else{
            return next(new ErrorHandler("Failed to create User", 400));
        }
    } 
    catch (error) {
        next(new ErrorHandler(error.message, 400));
        
    }
}


module.exports={signup,login,logout}

