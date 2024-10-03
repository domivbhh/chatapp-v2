const express=require('express')
const dotenv=require('dotenv')
const { errorController } = require('./middlewares/errorHandling')
const authRouter = require('./routes/authRoutes')
const messageRouter = require('./routes/messageRoutes')
const cuid=require('cuid')
const cookieParser=require('cookie-parser')


const app=express()
dotenv.config()


app.use(express.json())
app.use(cookieParser())


app.use('/auth',authRouter)
app.use('/message',messageRouter)

app.use('*',errorController)


app.listen(process.env.PORT,()=>{
    console.log(`server is listening to ${process.env.PORT}`)
})




