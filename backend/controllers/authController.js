const { ErrorHandler } = require("../middlewares/errorHandling")
const { loginValidate, signupValidate } = require("../middlewares/validate")
const bcrypt=require('bcryptjs')
const generateToken = require("../utils/generateToken")
const prisma = require("../utils/prismaClient")




const login=async(req,res,next)=>{
    try {
        const{email,password}=req.body

        //verifying req.body
        loginValidate(req,next)

        //checking user email
        const verifyUser=await prisma.user.findFirstOrThrow({
            where:{email}
        })

        //verifying password
        if(verifyUser.email){
            const verifyPass=await bcrypt.compare(password,verifyUser.password)

            //token generation
            const token=generateToken()
            if(verifyPass){
            
                const sendingData = await prisma.user.findUnique({
                where: { id: verifyUser.id },
                select: { password: false,name:true,email:true,profilePic:true,gender:true },
                    });

                res.cookie('chattoken',token,{maxAge:15*24*60*60*1000,httpOnly:true,sameSite:"strict"})
                res.status(200).json({
                    success:true,
                    data:sendingData
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
const signup=async(req,res,next)=>{
    try {
        const {name,email,password,gender}=req.body

        //validating data from request.body
        signupValidate(req,next)

        const boyProfilePic ="https://avatar.iran.liara.run/public/boy?username=[value]";
        const girlProfilePic ="https://avatar.iran.liara.run/public/girl?username=[value]";

        //verifying user already exits
        const checkUser=await prisma.user.findFirst({where:{email}})
        if(checkUser?.id){
            return next(new ErrorHandler('User already exists', 400));
        }

        //password hashing
        const hashedPass=await bcrypt.hash(password,10)
            
        //profile picture
        let profile=gender==="male"?boyProfilePic:girlProfilePic
        
        //user creating
        const newUser=await prisma.user.create({data:{
            name,email,password:hashedPass,profilePic:profile,gender
        }})

        //response
        if(newUser.id){
            const sendingData=await prisma.user.findUnique({where:{id:newUser.id},select:{password:false,name:true,email:true,gender:true,profilePic:true}})
            res.status(200).json({
                success:true,
                data:sendingData
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

