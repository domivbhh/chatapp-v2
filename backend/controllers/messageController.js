const { ErrorHandler } = require("../middlewares/errorHandling")
const prisma = require("../utils/prismaClient")

const sendMessage=async(req,res,next)=>{
    try 
    {
        const {message} =req.body
        const {id}=(req.params)       //receiver id
        const senderId=parseInt(req.user.id)

        // console.log(senderId)
        // console.log(id)
        let conversation =await prisma.conversation.findFirst({
            where:{
                participantId:{
                    hasEvery:[senderId,parseInt(id)]
                }
            }
        })

        const receiverDetails = await prisma.user.findFirst({
          where: {
            id: parseInt(id)
          },
        });


        //1st message send
        if(!conversation){
            conversation=await prisma.conversation.create({
                data:{
                    participantId:{
                        set:[senderId,parseInt(id)]
                    }
                }
            })
        }

        
        const newMessage = await prisma.message.create({
          data: {
            senderId,
            body: message,
            conversationId: conversation?.id,
          },
        });
        


        if(newMessage.id){
            const conversations = await prisma.conversation.update({
              where: {
                id: conversation.id,
              },
              data: {
                messages: {
                  connect: {
                    id: newMessage.id,
                  },
                },
                participants: {
                  connect: {
                    id: parseInt(id),
                  },
                },
                    messageId:{
                        set:[newMessage?.id]
                    }
              },
            });
        }

        res.status(201).json({
            data:{newMessage,sender:req.user.name,receiver:receiverDetails.name}
        })


    } 
    catch (error) {
        next(new ErrorHandler(error.message,400))
    }
}


const getMessage=async(req,res,next)=>{
    try {
            const{id}=req.params
            const senderId=req.user.id

            const conversation=await prisma.conversation.findFirst({
                where:{
                    participantId:{
                        hasEvery:[senderId,parseInt(id)]
                    }
                },
                include:{
                    messages:{
                        orderBy:{
                            createdAt:'asc'
                        }
                    }
                }
            })
            if(conversation.id){
                res.status(200).json({
                    success:true,
                    data:conversation.messages
                })
            }
            else{
                return next(new ErrorHandler('No conversation found',400))
            }
    } 
    catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
}



const getUserConversations=async(req,res,next)=>{
    try {
        const loggedInUser=req.user
        const users=await prisma.user.findMany({
            where:{
                id:{
                    not:loggedInUser.id
                },
        
            },
            select:{
                id:true,
                name:true,
                profilePic:true
            }
        })
        if(users.length>0){
                res.status(200).json({
                    success:true,
                    users
                })
        }
    } 
    catch (error) {
        next(new ErrorHandler(error.message, 400));   
    }
}


module.exports={sendMessage,getMessage,getUserConversations}