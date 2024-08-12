import mongoose from "mongoose";
import User from "../model/user.js";
import bcrypt from "bcrypt"
import generateCookie from "../util/helper/generateCookie.js";
import {v2 as cloudinary} from "cloudinary"
import generate_user from "../util/helper/genereate_data.js";

const signController = async(req, res) => {
    try{
        const {username,name,email,password} = req.body;
        const user = await User.findOne({ $or: [{email},{username}]}); 

        if(user){
            res.status(404).json({err:"user alreay exist"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            fname:name,
            lname:"",
            image:"",
            country:"",
            city:"",
            phone:"",
            address:"",
            pincode:"",
            email,
            password:hashedPass
        }) 
        await newUser.save();

        if(newUser){
            generateCookie(newUser._id,res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.fname,
                email: newUser.email,
                username: newUser.username
            });
        } 
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch(err){
        console.log(err)
        res.status(501).json({err:"internal server error"})
    }
}

const loginController = async(req, res) => {
    try{
        const {username,password} = req.body;
        if(!username || !password){
            res.status(404).json({err:"All field are required"});
            return;
        }

        const user = await User.findOne({username});
        if(!user){
            res.status(404).json({err:"User not exist"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            res.status(404).json({err:"incorrect password"});
            return;
        }
        generateCookie(user._id,res);
        res.status(200).json({
            _id: user._id,
            name: user.fname,
            email: user.email,
            username: user.username
        })
    }
    catch(err){
        console.log(err)

        res.status(505).json({err:"internal sever error"});
    }
}

const logoutController = async(req,res) => {
    try {
        res.cookie("jwt","",{maxAge:1});
		res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in signupUser: ", error.message);
        res.status(500).json({ error });

    }
}

const updateController = async(req,res) => {
    try {
        const {username,fname,lname,email} = req.body;
        let {ProfilePic,password} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(req.params.id !== userId.toString()){
            res.status(401).json({error:"Unauthorized user"});
        }
        if(!user){
            res.status(404).json({error:"User not found"});
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password || user.password, salt);
        }
        if(ProfilePic){
            if(uers.ProfilePic){
                await cloudinary.uploader.destroy(uers.ProfilePic.split("/").pop().split(".")[0])
            }
            const updateRes = await cloudinary.uploader.upload(ProfilePic)
            console.log(updateRes)
            ProfilePic = updateRes.secure_url;
        }

        const updateuser = await User.findByIdAndUpdate(userId,{
            fname:fname||user.fname,
            lname:lname||user.lname,
            username:username||user.username,
            email:email||user.email,
            password:password||user.password,
            country:user.country,
            city:user.city,
            phone:user.phone,
            address:user.address,
            pincode:user.pincode,
            image:ProfilePic||user.ProfilePic
        },{new:true})

        updateuser.password = null;
        if(updateuser){
            res.status(200).json(updateuser);
        }else{
            //create a cookie 
            generate_user(updateuser._id,res); 

            res.status(400).json({err:"Failed to update user"});
        }
    } catch (err) {
        console.log("Error in updateError: ", err.message);
        res.status(501).json({err:"internal server error"})
    }
}

export {loginController,signController,logoutController,updateController}