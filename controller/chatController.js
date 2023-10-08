const chatModel = require('../models/chatModel');
const userModel = require('../models/userModel');

module.exports.createChat = async function createChat(req,res){
    try{
        let tempdata = req.body; // urls array only
        const urls = tempdata["urls"]
        
        const user_id = req.id;
        tempdata["owner"] = user_id;
        
        ////////////////// TODO 
        let summary = [] // array of strings
        // generate summary for each url
        tempdata["summary"]=summary

        ////////////////// TODO: Good to add default message in frontend itself?
        // add prompt here in first message from user
        tempdata["message"]=[]; // can add default message here
        
        const user = await userModel.findById(user_id);
        const chat = await chatModel.create(tempdata);
        user.chats.push({id:chat["_id"],created:chat["created"]}); // add chat to user db
        await user.save();
        res.json({
            status:"ok",
            message:"chat created success",
            data:chat
        })
    }catch(e){
        res.json({
            status:"error",
            message:e.message
        })
    }
}

module.exports.getChat = async function getChat(req,res){
    try{
        const chat_id = req.params.id;
        const chat = await chatModel.findById(chat_id);
        if (chat["owner"]!=req.id){
            res.json({
                "status":"error",
                "message":"permission denied!"
            })
        }
        else{
            res.json({
                status:"ok",
                message:"chat fetched success",
                data:chat
            })
        }
    }catch(e){
        res.json({
            status:"error",
            message:e.message
        })
    }
}

module.exports.updateChat = async function updateChat(req,res){
    try{
        const chat_id = req.params.id;
        const chat = await chatModel.findById(chat_id);
        if (chat["owner"]!=req.id){
            res.json({
                "status":"error",
                "message":"permission denied!"
            })
        }
        else{
            const messages = req.body.messages // [{role:"",content:""}]
            for (var i=0;i<messages.length;i++)chat.messages.push(messages[i]);
            await chat.save();
            res.json({
                "status":"ok",
                "message":"chat updated success"
            })
        }
    }catch(e){
        res.json({
            status:"error",
            message:e.message
        })
    }
}

module.exports.deleteChat = async function deleteChat(req,res){
    try{
        const chat_id = req.params.id;
        const user_id = req.id;
        const user = await userModel.findById(user_id);
        user.chats.pull(chat_id)
        await user.save();
        let chat = await chatModel.findById(chat_id);
        if (chat["owner"]==user_id){
            await chatModel.findByIdAndDelete(chat_id);
            res.json({
                status:"ok",
                message:"chat deleted successfully",
                data:chat
            })
        }
        else{
            res.json({
                status:"error",
                message:"permission denied",
                data:chat
            })
        }
    }catch(e){
        res.json({
            status:"error",
            message:e.message
        })
    }
}
