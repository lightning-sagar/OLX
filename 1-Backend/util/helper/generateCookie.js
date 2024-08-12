import jwt from "jsonwebtoken"

const generateCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })
    res.cookie("jwt",token,{  
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:30*24*60*60*1000
    })
    return token
}

export default generateCookie