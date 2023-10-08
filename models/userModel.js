const mongoose  = require('mongoose');
const db_link = 'mongodb+srv://shaleen:Tl4p3u2EEJSoz6jj@cluster0.jeczk2g.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then((db)=>{
        console.log('user database connected');
    })
    .catch((err)=>{
        console.log("user connection error: ",err);
    })

const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:[true,"Please provide a name"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Password length must be eight"]
    },
    confirmPassword:{
        type:String,
        require:[true,"Please confirm the password"],
        validate:{
            validator: function(){
                return this.confirmPassword == this.password;
            },
            message:"Passwords not similar"
        }
    },
    chats:[{
        id:{
            type:mongoose.Schema.ObjectId,
            ref:'chatModel'
        },
        created:{
            type:Date,
            //default:Date.now()
        }
    }]
})

userSchema.pre('save',function(){
    this.confirmPassword = undefined;
});

userSchema.post('save',function(error,doc,next){
    if (error && error.name==="MongoServerError" && error.code === 11000) next(new Error('username already taken'));
    else next(error);
});

// userSchema.pre(/^find/,function(next){
//     this.populate("chats");
//     next();
// })

const userModel = mongoose.model('userModel',userSchema);
module.exports = userModel;
