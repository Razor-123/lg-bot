import React, {useState,useEffect} from 'react'
import { Dialog,DialogTitle,DialogActions,Box, Button, TextField,Toolbar,IconButton,Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate,Link } from 'react-router-dom';
import { server_home } from '../secret/secret';
import lucidicon from '../assets/lucid.jpg'
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function Input() {
  const [textUrls,setTextUrls] = useState("")
  const [tempUrls,setTempUrls] = useState();
  const [showLoading,setShowLoading] = useState(false);
  const [showDone,setShowDone] = useState(false);
  const [chatId,setChatId] = useState("");
  const navigate = useNavigate();
  const logout = async() => {
    const response = await fetch(`${server_home}/user/logout`,{
      method:'GET',
      headers:{
          'Content-Type':'application/json',
      },
      credentials: 'include'
    })
    const data = response.json();
    data.then(res=>{
      console.log(res);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      navigate('/login');
    })
  }
  const handleAlertClose = () => {
    navigate('/login')
  }
  const handleDoneClose = () => {
    navigate('/chat/'+chatId);
  }
  const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

  const handleTextUrlChange = (event) => {
    const { value } = event.target;
    setTextUrls(value);
    const lines = value.split('\n');
    setTempUrls(lines);
  };
  const startChat = async()=>{
    console.log(tempUrls)
    // TODO -> check tempUrls valid, not empty, clean them here
    // pass on the url list to backend and get the chat_id
    // show loading screen meanwhile
    setShowLoading(true);
    const response = await fetch(`${server_home}/chat`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include',
      body:JSON.stringify({
        "urls":tempUrls
      })
    })
    const data = response.json();
    data.then(res=>{
      console.log(res);
      if (res.status=="ok"){
        const chat_id = res.data["_id"];
        setChatId(chat_id);
        setShowLoading(false);
        setShowDone(true);
      }else{
        // show error occured res.message
      }
    })
  }
  return (
    <div>
      <Box className='nav' component="nav" sx={{borderBottom: '1px solid grey'}} >
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
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
                    <Button key="profile" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={()=>navigate('/profile')}>Profile</Button>
                    <Button key="logout" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={logout}>Logout</Button>
                </Box>
            </Toolbar>
      </Box>
      <center>
        <Dialog fullWidth={true} open={showDone} onClose={handleDoneClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            Chat created successfully!
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleDoneClose}>Ok</Button>
          </DialogActions>
        </Dialog>
        <Box sx={{maxWidth:"800px",display: 'flex',flexDirection: 'column',justifyContent:'center' ,height:'90vh'}}>
          <TextField
            disabled={showLoading}
            fullWidth
            id="outlined-multiline-flexible"
            label="Enter Urls"
            multiline
            value={textUrls}
            onChange={handleTextUrlChange}
            maxRows={20}
          />
          <br/>
          <Box sx={{display:"flex",justifyContent:"center"}}>
            <LoadingButton endIcon={<PlayArrowIcon/>} sx={{maxWidth:"300px"}} size="small" onClick={startChat} loading={showLoading} loadingPosition="end" variant="contained">
              {(!showLoading)?(<>Start Chat</>):(<>Generating Chat</>)}
            </LoadingButton>
          </Box>
        </Box>
      </center>
    </div>
  )
}

export default Input