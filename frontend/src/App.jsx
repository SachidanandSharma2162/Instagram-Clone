import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/profile';
import Explore from './pages/Explore';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { UserProvider } from './context/userContext';
import CreatePost from './components/CreatePost';
import {Toaster} from 'react-hot-toast'
import EditProfile from './components/EditProfile';
const App = () => {
  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
      <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/:username" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create' element={<CreatePost/>}/>
        <Route path='/edit/:username' element={<EditProfile/>}/>
      </Routes>
      </UserProvider>
    </>
  );
};

export default App;
