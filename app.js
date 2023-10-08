const express = require('express');
const chatRouter = require('./Routers/chatRouter');
const userRouter = require('./Routers/userRouter')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const dotenv = require('dotenv')
dotenv.config()

app.use(cors({
    origin:"https://lg-bot.onrender.com",
    //origin:"http://localhost:3001",
    credentials:true
}));
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:true,limit:'50mb'}))
app.use('/user',userRouter);
app.use('/chat',chatRouter)
//app.use('/util',utilRouter);


const port = process.env.PORT || 3001;

// const isProduction = process.env.NODE_ENV === "production";
// isProduction && app.use(express.static(path.join(__dirname,"build")));
// isProduction &&
//   app.get("*", function (request, response) {
//     response.sendFile(path.join(__dirname,"build","index.html"));
//   });

const buildPath=path.join(__dirname, 'build')
app.use(express.static(buildPath))
app.use(express.json())
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.get('/',(req,res)=>{
    res.json({
        message:"Hello World!"
    })
})


app.listen(port,()=>{
    console.log("listening to port: ",port)
});

