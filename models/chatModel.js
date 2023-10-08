const mongoose  = require('mongoose');
const db_link = 'mongodb+srv://shaleen:Tl4p3u2EEJSoz6jj@cluster0.jeczk2g.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then((db)=>{
        console.log('chat database connected');
    })
    .catch((err)=>{
        console.log("chat connection error: ",err);
    })

const chatSchema = mongoose.Schema({
    owner:{
        type:String,
        required:[true,"No owner id"]
    },
    urls:[{
        type:String
    }],
    summary:[{
        type:String
    }],
    messages:[{
        role:String,
        content:String
    }],
    created:{ // time
        type:Date,
        default:Date.now()
    }
})

const chatModel = mongoose.model('chatModel',chatSchema);
module.exports = chatModel;
