import mongoose from "mongoose";
import Product from "../model/product.js";
import { v2 as cloudinary } from "cloudinary";

const postProduct = async(req,res) => {
    try {
        const {pname,pbio,pprice,pcategory,pavaliable,pstock} = req.body;
        const owner = req.user._id;

        let {pimage} = req.body;

        if(pimage){
            const resUpload = await cloudinary.uploader.upload(pimage);
            pimage = resUpload.secure_url;
        }
        if(!pname || !pbio || !pprice || !pimage || !pcategory || !pavaliable || !pstock){
            res.status(401).json({err:"all fields are required"})
        }

        const newProduct = new Product({
            owner,
            pname,
            pbio,
            pprice,
            pimage,
            pcategory,
            pavaliable,
            pstock
        })
        await newProduct.save();
        res.status(201).json({msg:"product added successfully"})
    } catch (err) {
        console.log(err)
        res.status(501).json({err:"internal server error"})
    }
}

const getProduct = async(req,res) => {
    try {
        const Allproduct = await Product.find();
        console.log(Allproduct);
        res.status(201).json(Allproduct)
    } catch (err) {
        console.log(err)
        res.status(501).json({err:"internal server error"})    
    }
}
export {postProduct,getProduct}