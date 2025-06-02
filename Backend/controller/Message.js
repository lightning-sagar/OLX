import Conservation from "../model/conservation.js";
import Message from "../model/message.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import {v2 as cloudinary} from "cloudinary"

const   sendMessage = async(req, res) => {
    try {
        const { message, recipient } = req.body;
        const senderId = req.user._id;
        let {img} = req.body;
        console.log(img,"img in messageController");
        let conservation = await Conservation.findOne({
            participants: { $all: [senderId, recipient] }
        });

        if (!conservation) {
            conservation = new Conservation({
                participants: [senderId, recipient],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            });
            conservation = await conservation.save();
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newMessage = new Message({
            conservationId: conservation._id,
            sender: senderId,
            text: message,
            pimage: img||""
        });
        console.log(newMessage);
        await Promise.all([
            newMessage.save(),
            conservation.updateOne({
                lastMessage: {
                    sender: senderId,
                    text: message,
                    seen: false
                }
            })
        ]);

        const recipientId = getRecipientSocketId(recipient);
        if (recipientId) {
            io.to(recipientId).emit("newMessage", newMessage);
        }
        res.status(200).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

const getMessage = async(req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user._id;
    try {
        const conservation = await Conservation.findOne({
            participants: { $all: [userId, otherUserId] }
        });
        if (!conservation) {
            return res.status(404).json({ error: "No conservation found" });
        }
        const messages = await Message.find({ conservationId: conservation._id }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getConservation = async(req, res) => {
    const userId = req.user._id;
    try {
        const conservations = await Conservation.find({ participants: userId })
            .populate({
                path: "participants",
                select: "username pimage",
            })
            .populate({
                path: "lastMessage.sender",
                select: "username pimage",
            });
        
        conservations.forEach(conservation => {
            conservation.participants = conservation.participants.filter(participant => participant._id.toString() !== userId.toString());
        });
        res.status(200).json(conservations);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { sendMessage, getMessage, getConservation };