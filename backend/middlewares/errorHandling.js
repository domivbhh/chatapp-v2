class ErrorHandler extends Error{
    constructor(message,code){
        super(message,code)
        this.message=message
        this.code=code
    }
}


const errorController=async(err,req,res,next)=>{
    statusMessage=err.message
    statusCode=err.code
    res.status(statusCode).json({
        success:false,
        message:statusMessage
    })
}


module.exports={ErrorHandler,errorController}