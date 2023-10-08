import './App.css';
import { BrowserRouter as Router,Routes,Route,} from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Input from './pages/Input';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/input' element={<Input/>}/>
        <Route exact path='/chat/:id' element={<Chat/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/signup' element={<Signup/>} />
        <Route exact path='/profile' element={<Profile/>}/>
      </Routes>
    </Router>
  )
}

export default App;
