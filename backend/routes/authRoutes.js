const express=require('express')
const { signup, login, logout, profileController } = require('../controllers/authController')
const { authorize } = require('../middlewares/authorize')


const authRouter=express.Router()


authRouter.post('/login',login)
authRouter.post('/signup',signup)
authRouter.post('/logout',logout)
authRouter.get('/profile',authorize,profileController)


module.exports=authRouter