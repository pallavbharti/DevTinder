const jwt = require("jsonwebtoken");
const User = require("../modules/user");

const userAuth = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid!!");
        }
        const decodedObj = jwt.verify(token, "DEV@Tinder$790");
        const {_id} = decodedObj;
        const user = await findbyId(_id);
        if(!user){
            throw new Error("User not found!!");
        }
        next();
    }catch(err){
        res.status(404).send({message:"Authentication failed", error:err.message});
    }
}