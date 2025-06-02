import {Server} from "socket.io"
import http from "http"
import express from "express"
import Message from "../model/message.js"  
import Conservation from "../model/conservation.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

export const getRecipientSocketId = (recipientId) => {
    return useSocketMap[recipientId]
}

const useSocketMap = {}

io.on('connection',(socket)=>{
    console.log(`User connected: ${socket.id}`)
    const userId = socket.handshake.query.userId;
    if(userId != undefined){
        useSocketMap[userId] = socket.id
    }
    
    io.emit("getOnlineUsers",Object.keys(useSocketMap))

    socket.on("markMessageAsSeen",async({conservationId,userId})=>{
        try {
            await Message.updateMany({conservationId:conservationId,seen:false},{$set:{seen:true}})
            await Conservation.updateOne({_id:conservationId}, { $set: { "lastMessage.seen": true } });
            io.to(useSocketMap[userId]).emit("messageSeen",{conservationId})
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        delete useSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(useSocketMap))

    })
})

export {io,server,app}