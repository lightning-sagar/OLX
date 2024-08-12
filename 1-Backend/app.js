import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./db/db.js"
import cookieParser from "cookie-parser";
import userRoute from "./route/userRoute.js"
import productRoute from "./route/productRoute.js"
dotenv.config();


const app = express();

connectDB();
app.use(express.json({ limit: "50mb" }));  
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());

app.use('/api/user',userRoute);
app.use('/api/p',productRoute);

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`workinng on port ${port}`)
})