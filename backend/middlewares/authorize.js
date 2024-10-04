
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
const prisma = require('../utils/prismaClient')
const { ErrorHandler } = require('./errorHandling')

dotenv.config()

const authorize=async (req,res,next)=>{
    const {chattoken}=req.cookies
    if(chattoken)
    {
    const tokenVerify=jwt.verify(chattoken,process.env.JWT_SECRET)
    if(tokenVerify)
    {
        const users=await prisma.user.findUnique({where:{id:tokenVerify.id},select:{id:true,name:true,password:false,email:true,profilePic:true}})
        if(users.id)
        {
            req.user=users
            next()
        }
        else
        {
            next(new ErrorHandler('Please login again Token expired',400))
        }
    }
    }
}



module.exports={authorize}