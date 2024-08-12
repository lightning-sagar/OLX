import jwt from "jsonwebtoken"

const generate_user = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"1year"
    })
    res.cookie("user_token",token,{  
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:365*24*60*60*1000
    })
    return token
}

export default generate_user