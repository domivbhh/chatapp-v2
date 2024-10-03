const express=require('express')
const { signup, login, logout } = require('../controllers/authController')


const authRouter=express.Router()


authRouter.post('/login',login)
authRouter.post('/signup',signup)
authRouter.post('/logout',logout)


module.exports=authRouter