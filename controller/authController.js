const userModel = require('../models/userModel');
const chatModel = require('../models/chatModel');
const JWT_KEY = require('../secret/secret').JWT_KEY;
const jwt = require('jsonwebtoken');

module.exports.signup = async function signup(req,res){
    try{
        const tempdata = req.body;
        const user = await userModel.create(tempdata);
        if (user){
            res.json({
                status:"ok",
                message:"user signup success",
                data:user
            })
        }else{
            res.json({
                status:"error",
                message:"error while signup"
            })
        }
    }catch(err){
        //console.log("err ",err);
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.login = async function login(req,res){          ///////////////////////////////
    try{
        let data = req.body;
        if (data.username){
            let user = await userModel.findOne({username:data.username,password:data.password});
            if (user){
                let uid = user['_id'];
                let jwt_ = jwt.sign({payload:uid},JWT_KEY);
                res.cookie('login',jwt_,{httpOnly:true});
                res.json({
                    status:"ok",
                    "token":jwt_,
                    message:"User logged in",
                    data: user
                })
            }
            else{
                res.json({
                    status:"error",
                    message:"Wrong Credentials"
                })
            }
        }else{
            res.json({
                status:"error",
                message:"Please enter valid user name"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.protectRoute = async function protectRoute(req,res,next){
    try{
        console.log("in protect route")
        let token;
        //console.log(req.cookies);
        if (req.cookies && req.cookies.login){
            token = req.cookies.login;
            let payload = jwt.verify(token,JWT_KEY);
            if (payload){
                const user = await userModel.findById(payload.payload);
                if (user)req.id = user.id;
                next();
            }else{
                // browser - redirect to login
                const client = req.get('User-Agent');
                if (client.includes('Mozilla')==true){
                    return res.redirect('/login'); // please login
                }else{
                    res.json({
                        status:"error",
                        message:"Please retry"
                    })
                }
            }
        }else{
            res.json({
                status:"error",
                message:"please log in"
            })
        }
    }catch(err){
        res.json({
            status:"error",
            message:err.message
        })
    }
}

module.exports.logout = function logout(req,res){
    res.cookie('login','',{maxAge:1});
    res.json({
        status:"ok",
        message:"User log out success"
    })
}
