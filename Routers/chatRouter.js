const express = require('express');
const chatRouter = express.Router();
const {protectRoute} = require('../controller/authController');
const {createChat,getChat,updateChat,deleteChat} = require('../controller/chatController')

chatRouter.use(protectRoute);

chatRouter.route('/')
    .post(createChat)

chatRouter.route('/:id')
    .get(getChat)
    .patch(updateChat)
    .delete(deleteChat)

module.exports = chatRouter;