import React,{useState,useEffect} from 'react'
import { CircularProgress,Paper,Grid,Container,ListItem,ListItemText,Box,Dialog,DialogTitle,Button,DialogActions,Toolbar,IconButton,Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import lucidicon from '../assets/lucid.jpg'
import { useNavigate,Link } from 'react-router-dom';
import { server_home } from '../secret/secret';
import Avatar from '@mui/material/Avatar';

function Profile() {
    const navigate = useNavigate();
    const [userName,setUserName] = useState("");
    const [chatsCount,setChatsCount] = useState(0);
    const [elevation,setElevation] = useState(5);
    const [loggedIn,setLoggedIn] = useState(true);

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
              setChatsCount(res.data.chats.length)
              setUserName(res.data.username)
            }else{
              setLoggedIn(false);
            }
          })
        }catch(e){
          console.log("server not responding!!")
          setLoggedIn(false);
        }
      }
    useEffect(()=>{
        getUser();
    },[])

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    const handleAlertClose = () => {
        navigate('/login')
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
                    <Button key="home" sx={{ color: 'black',margin:"0px 4px 0px 4px" }} onClick={()=>navigate('/')}>Home</Button>
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
        {
        userName==''?(
            <Box sx={{ display: 'flex',alignItems:"center",justifyContent:"center",minHeight:"70vh" }}>
                <CircularProgress />
            </Box>
        ):(
            <Box sx={{marginTop:"40px",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <Avatar sx={{ margin:"10px 0px 20px 0px",width: 56, height: 56 }}/>
                <Paper elevation={elevation} onMouseOut={()=>setElevation(5)} onMouseOver={()=>setElevation(20)} sx={{ padding:"20px",width:"50%",minWidth:"300px",maxWidth:"600px"}}>
                <Box sx={{margin:2}}>
                    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid display="flex" flexDirection="column" alignItems="center" item xs={6}>User Name</Grid>
                    <Grid display="flex" flexDirection="column" alignItems="center"  item xs={6}><Typography>{userName}</Typography></Grid>
                    <Grid display="flex" flexDirection="column" alignItems="center"  item xs={6}>Chats count</Grid>
                    <Grid display="flex" flexDirection="column" alignItems="center"  item xs={6}>{chatsCount}</Grid>
                    </Grid>
                </Box>
                </Paper>
            </Box>
          )
        }
        
    </Box>
  )
}

export default Profile