import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    image:{
        type:String,
    },
    username:{
        type: String,
        required:true
    }, 
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    country:{
        type:String
    },
    city:{
        type:String
    },
    phone:{
        type:Number
    },
    address:{
        type:String
    },
    pincode:{
        type:Number
    }
},{timestamps:true})

export default mongoose.model("User",userSchema);