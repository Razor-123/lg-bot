const express = require('express');
const userRouter = express.Router();
const {login,logout,signup,protectRoute} = require('../controller/authController');
const {myprofile} = require('../controller/userController')
userRouter.route('/login')
    .post(login)

userRouter.route('/logout')
    .get(logout)

userRouter.route('/signup')
    .post(signup)

userRouter.use(protectRoute);

userRouter.route('/')
    .get(myprofile)

module.exports = userRouter;
