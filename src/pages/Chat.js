import '../styles/Chat.css'
import React, {useState,useEffect,useRef} from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {TextField, AppBar, Toolbar, IconButton, Box, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import bg from '../assets/bg.jpg'
import usericon from '../assets/user.jpg'
import lucidicon from '../assets/lucid.jpg'
import { server_home } from '../secret/secret';

function Chat(){
    //const api_key = "";
    const api_key = process.env.REACT_APP_GPT_KEY
    const navigate = useNavigate();
    const [message,setMessage] = useState(""); // store current text in textfield
    const [messageList,setMessageList] = useState([]) // store all the messages to display
    const [bufferList,setBufferList] = useState([]) // store messages not synced
    const chat_id = useParams().id;
    const [enableTyping,setEnableTyping] = useState(false); // enable send button

    const alwaysMessage =  {
        role:"user",
        content:"data: google is good"
    };
    
    const chatBodyRef = useRef();

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    useEffect(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, [messageList]);

    async function fetchMessages(){ // only run in the start
        const response = await fetch(server_home+"/chat/"+chat_id,{
            method:"GET",
            headers:{
            'Content-Type':'application/json'
            },
            credentials:'include'
        })
        const data = response.json();
        data.then(res=>{
            console.log(res)
            if (res.status=="ok"){
                // DONE -> update messageslist
                let tempMessageList = res.data.messages.map((obj)=>{
                    return {"role":obj.role,"content":obj.content}
                })
                setMessageList(tempMessageList)
                // TODO -> update always message to summaries of companies
                setEnableTyping(true);
            }else{
                // TODO -> show some error occured and ask to retry
            }
        })
    }
    useEffect(()=>{
        fetchMessages();
    },[])

    const sendMessage = async (e) => {
        if (message.trim().length===0 || !enableTyping)return;
        let newMessage = {content: message,role: "user"}
        const newMessages = [...messageList, newMessage];
        const newBufferList = [...bufferList,newMessage];
        setBufferList(newBufferList)
        setMessageList(newMessages)
        setMessage("")
        setEnableTyping(false);
        await askAI(newMessages,newBufferList);
    }

    async function uploadChat(newBufferList){
        try{
            console.log("uploadChat called with buffer: ",newBufferList)
            await fetch(server_home+"/chat/"+chat_id,{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:'include',
                body:JSON.stringify({
                    messages:newBufferList
                })
            }).then((data)=>{
                return data.json();
            }).then((res)=>{
                console.log(res);
                if (res.status=="error"){ // adding before current messages
                    setBufferList(prevItems=>[...newBufferList,...prevItems]);
                }
            })
        }catch(e){
            console.log("upload chat error: ",e);
        }
    }

    async function askAI(chatMessages,givenBufferList){
        try{
            const systemMessage = {
                role: "system",
                content:"You are a q&a bot, give answers to query using the given data only"
            }
            await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                    systemMessage, 
                    alwaysMessage, // contain data of companies
                    ...chatMessages,
                    ]
                })
            }).then((data)=>{
                return data.json();
            }).then((data)=>{
                console.log(data);
                const newMessage = {
                    role: "assistant",
                    content:data.choices[0].message.content
                }
                const newBufferList = [...givenBufferList,newMessage];
                setBufferList([]); // empty the current buffer list
                uploadChat(newBufferList);
                setEnableTyping(true);
                const newMessageList = [...chatMessages,newMessage];
                setMessageList(newMessageList);
            })
        }catch(e){
            console.log(e);
        }
    }
    function handleKeyDown(e){
        if (e.key==='Enter' && !e.shiftKey){
            e.preventDefault();
            sendMessage(e);
        }
    }
    return (
    <div className="container" style={{display:"flex",flexDirection:"column",height:"100vh"}}>
        <Box className='nav' component="nav" sx={{borderBottom: '1px solid grey'}} >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1,color:"black", display: { xs: 'none', sm: 'block' } }}>
                <Box sx={{display:"flex",alignItems:"center"}}>
                    <Box onClick={()=>navigate('/')} sx={{cursor:"pointer",display:"flex",alignItems:"center"}}>
                        <img className='lucidicon' height="35px" src={lucidicon} />
                        <Typography variant="h6" component="div" sx={{padding:"0px 10px 0px 10px"}} onClick={()=>navigate('/')}>
                            LG Bot
                        </Typography>
                      </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Button key="home" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={()=>navigate('/')}>Home</Button>
                    <Button key="input" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={()=>navigate('/input')}>New Chat</Button>
                    <Button key="profile" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={()=>navigate('/prfile')}>Profile</Button>
                </Box>
            </Toolbar>
        </Box>
        <Box ref={chatBodyRef} sx={{flexGrow: 1,overflowY:"auto"}} >
        {
            messageList.map((mes,idx)=>(
                <div  key={idx} style={{justifyContent: 'flex-start',padding:"10px 50px 10px 70px",marginTop:"16px"}} className='messageContainer'>
                    <Box sx={{marginTop:"8px",paddingRight:"10px"}}>
                        <img style={{borderRadius:"50%"}} height="30px" width="30px" src={mes.role=="user" ? usericon : lucidicon} />
                    </Box>
                    <div className='messageStyle'
                        style={{border:"1px solid rgb(223, 227, 235)",backgroundColor: mes.role == 'user' ?  'white' : 'rgb(246, 249, 254)'}}
                        >
                        {mes.content}
                    </div>
                </div>
            ))
        }
        </Box>
        <Box sx={{marginTop:"auto"}}>
            <Box sx={{display:"flex",justifyContent:"center"}}>
                <Box sx={{display:"flex",minWidth:"600px",maxWidth:"900px",width:"80vw",padding:"20px",margin:"10px 0px 30px 0px",border:"2px solid grey",borderRadius:"5px"}}>
                    <Box sx={{width:"100%",display:"flex",alignItems:"center"}}>
                        <TextField
                            fullWidth placeholder='Type a message' multiline maxRows={100} variant="standard"
                            onKeyDown={handleKeyDown} value={message} onChange={(e)=>setMessage(e.target.value)}
                        />
                    </Box>
                    <Box sx={{margin:"0px 0px 0px 15px"}} className='sendIconContainer'>
                        <Button disabled={message.length==0 || !enableTyping} size="small" onClick={(e)=>sendMessage(e)} variant="contained" endIcon={<SendIcon />}>
                            Send
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    </div>
    );
}

export default Chat;