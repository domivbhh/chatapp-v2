const express = require("express");
const { authorize } = require("../middlewares/authorize");
const { sendMessage, getMessage, getUserConversations } = require("../controllers/messageController");

const messageRouter = express.Router();

messageRouter.get('/conversations',authorize,getUserConversations)
messageRouter.get('/:id',authorize,getMessage)
messageRouter.post('/send/:id',authorize,sendMessage)





module.exports=messageRouter