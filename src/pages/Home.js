import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { CircularProgress,Container,ListItem,ListItemText,Box,Dialog,DialogTitle,Button,DialogActions,Toolbar,IconButton,Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import "../styles/Home.css"
import { server_home } from '../secret/secret';
import lucidicon from '../assets/lucid.jpg'

function Home() {
  const navigate = useNavigate();
  const [loggedIn,setLoggedIn] = useState(true)
  const [prevChats,setPrevChats] = useState([]);
  const [userName,setUserName] = useState("");
  const formateDate = (str) => {
    const dateObj = new Date(str);
    return dateObj.toLocaleDateString()+ " ("+dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })+")";
  }
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

  const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    async function tryLogin(username,password){
      console.log("trying to log in")
      const response = await fetch(`${server_home}/user/login`,{
          method:'POST',
          headers:{
              'Content-Type':'application/json',
          },
          body:JSON.stringify({
              username:username,
              password:password
          }),
          credentials:'include',
      })
      const data = response.json();
      data.then(res=>{
          console.log(res);
          if (res.status==="ok"){
              localStorage.setItem('username',res.data.username);
              localStorage.setItem('password',res.data.password);
              getUser();
          }else{
              //alert(res.message);
              setLoggedIn(false);
          }
      })
    };

  async function getUser(){
    try{
      const response  = await fetch(server_home+"/user",{
        method:"GET",
        headers:{
          'Content-Type':'application/json'
        },
        credentials:'include'
      })
      const data = response.json();
      data.then(res=>{
        console.log(res);
        if (res.status=="ok"){
          // store ans show user data or whatever
          setPrevChats(res.data.chats)
          setUserName(res.data.username);
        }else{
          let username = localStorage.getItem('username');
          let password = localStorage.getItem('password');
          if(res.message=="please log in") tryLogin(username,password);
        }
      })
    }catch(e){
      console.log("server not responding!!")
      setLoggedIn(false);
    }
  }
  useEffect(()=>{
    getUser();// fetch user info
  },[])
  return (
    <Box sx={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <Box className='nav' component="nav" sx={{borderBottom: '1px solid grey'}} >
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                    <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1,color:"black", display: { xs: 'none', sm: 'block' } }}>
                  <Box sx={{display:"flex",alignItems:"center"}}>
                      <Box onClick={()=>navigate('/')} sx={{cursor:"pointer",display:"flex",alignItems:"center"}}>
                        <img className='lucidicon' height="35px" src={lucidicon} />
                        <Typography variant="h6" component="div" sx={{padding:"0px 10px 0px 10px"}}>
                            LG Bot
                        </Typography>
                      </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Button key="home" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={()=>navigate('/profile')}>Profile</Button>
                    <Button key="home" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={logout}>Logout</Button>
                </Box>
            </Toolbar>
      </Box>
      <Dialog fullWidth={true} open={!loggedIn} onClose={handleAlertClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Please Log In!
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleAlertClose}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{display:"flex",justifyContent:"center",margin:"40px 0px 10px 0px"}}>
        <button class="button-64" onClick={()=>navigate('/input')}>Create new Chat</button>
      </Box>
      <Box sx={{padding:"30px"}}>
        {
        userName==''?(
          <Box sx={{ display: 'flex',alignItems:"center",justifyContent:"center",minHeight:"50vh" }}>
              <CircularProgress />
          </Box>
        ):(
          <Box>
            <center>
              {
                prevChats.length==0?(<></>):(<Box sx={{margin:"10px 0px 10px 0px"}}><Typography variant="h6">Chat History</Typography></Box>)
              }
            </center>
            <Container component="main" maxWidth="md">
              <Box sx={{marginTop:3,display: 'flex',flexDirection: 'column',alignItems: 'center',}}>
                {
                prevChats.map((obj,idx)=>{
                  return (
                    <ListItem onClick={()=>{navigate(`/chat/${obj.id}`)}} sx={{ cursor: 'pointer',borderRadius:"10px", padding:"20px", boxShadow: 2,margin:"10px 0px 15px 0px"}}
                        secondaryAction={
                            <div>
                                <Box title='Created On' edge="end">
                                    <Typography variant="button" >{formateDate(obj.created)}</Typography>
                                </Box>
                            </div>
                        }
                    >
                        <ListItemText primary={`${obj.id}`}/>
                    </ListItem>
                  )
                })
                }
            </Box>
            </Container>
          </Box>
        )
        }
        
      </Box>
    </Box>
  )
}

export default Home