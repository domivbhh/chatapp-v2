const validator=require('validator')
const { ErrorHandler } = require('./errorHandling')

const loginValidate=(req,next)=>{
    const {email,password}=req.body

    if(!email || !password){
        next(new ErrorHandler('Fill the required fields',400))
    }
    else if(email && !validator.isEmail(email)){
        next(new ErrorHandler("Invalid email", 400));
    }

}


const signupValidate=(req,next)=>{
    const{email,password,name}=req.body

    if (!email || !password || !name) {
      next(new ErrorHandler("Fill the required fields", 400));
    }

    else if (!email || !password) {
      next(new ErrorHandler("Fill the required fields", 400));
    } 
    else if (email && !validator.isEmail(email)) {
      next(new ErrorHandler("Invalid email", 400));
    }

    else if(password && !validator.isStrongPassword(password)){
      next(new ErrorHandler("Strong password is Required", 400));
    }

    else if(name && !validator.isLength(name,{min:2})){
      next(new ErrorHandler("Name must be more than 2 characters", 400));
    }

}









module.exports={loginValidate,signupValidate}