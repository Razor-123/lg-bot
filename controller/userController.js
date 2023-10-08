const userModel = require('../models/userModel');

module.exports.myprofile = async function myprofile(req,res){
    try{
        const user = await userModel.findById(req.id);
        res.json({
            status:"ok",
            message:"user profile fetched success",
            data:user
        })
    }catch(e){
        res.json({
            status:"error",
            message:e.message
        })
    }
}