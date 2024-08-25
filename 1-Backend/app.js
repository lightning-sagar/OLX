import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./route/userRoute.js";
import productRoute from "./route/productRoute.js";
import {app,server } from "./socket/socket.js"
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import messageRoutes from "./route/messageRoutes.js";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    timeout: 6000000
});


connectDB();
const _dirname = path.resolve();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/user', userRoute);
app.use('/api/p', productRoute);
app.use('/api/message',messageRoutes);


const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`http://localhost:${port}`));

