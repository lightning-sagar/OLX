import mongoose from "mongoose";
import User from "../model/user.js";
import bcrypt from "bcrypt"
import generateCookie from "../util/helper/generateCookie.js";
import {v2 as cloudinary} from "cloudinary"

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

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ err: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ err: "Invalid credentials" });
        }
        generateCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            name: user.fname,
            email: user.email,
            username: user.username
        });

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            return res.status(500).json({ err: "Internal server error" });
        }
    }
};

const logoutController = async(req,res) => {
    try {
        res.cookie("jwt","",{maxAge:1});
		res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in signupUser: ", error.message);
        res.status(500).json({ error });

    }
}

const updateController = async (req, res) => {
    try {
        const { username, fname, lname, email, country, city, phone, address, pincode } = req.body;
        let { profilePic, password } = req.body;

        const userId = req.user._id;

        // Validate user ID
        if (req.params.id !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized user" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Handle password update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }

        // Handle profile picture upload to Cloudinary
        if (req.file) {
            if (user.ProfilePic) {
                await cloudinary.uploader.destroy(user.ProfilePic.split("/").pop().split(".")[0]);
            }
            const updateRes = await cloudinary.uploader.upload(req.file.path);
            profilePic = updateRes.secure_url;
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fname: fname || user.fname,
                lname: lname || user.lname,
                username: username || user.username,
                email: email || user.email,
                password: password || user.password,
                country: country || user.country,
                city: city || user.city,
                phone: phone || user.phone,
                address: address || user.address,
                pincode: pincode || user.pincode,
                image: profilePic || user.ProfilePic
            },
            { new: true }
        );

        if (updatedUser) {
            updatedUser.password = null;
            return res.status(200).json(updatedUser);
        } else {
            return res.status(400).json({ error: "Failed to update user" });
        }
    } catch (err) {
        console.error("Error in update:", err);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

export {loginController,signController,logoutController,updateController}