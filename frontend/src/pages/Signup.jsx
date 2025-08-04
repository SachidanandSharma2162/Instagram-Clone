import React from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { useUser } from '../context/userContext';
const Signup = () => {
    const {user,url, setUser, isAuthenticated, setIsAuthenticated} = useUser();

    const navigate=useNavigate();
    const [error,setError]=useState(null)
    const [formData,setFormData]=useState({
      fullName:"",
      email:"",
      username:"",
      password:""
    })
    const handleChange=(e)=>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value
      })
    }
    const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${url}/users/signup`, formData, {
        withCredentials: true,
      });

      setUser(res.data.user);
      setIsAuthenticated(true); 
      navigate(`/user/${res.data.user.username}`); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Signup failed.";
      console.error("Signup error:", errorMessage);
      setError(errorMessage);
    }
  };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="border rounded-lg border-gray-300 p-8 w-96 bg-white">
            <img
            src="/images/instaLogo.png"
            alt="Instagram preview"
            className="w-full object-contain h-40"
          />
            <p className="text-center text-sm text-gray-500 mb-4">
              Sign up to see photos and videos from your friends.
            </p>
    
        
    
            <form
                onSubmit={submitHandler}
            className="flex flex-col space-y-2">
              <input
              name='email'
                onChange={handleChange}
                type="text"
                placeholder="Mobile Number or Email"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                name='password'
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                name='fullName'
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <input
                name='username'
                onChange={handleChange}
                type="text"
                placeholder="Username"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                People who use our service may have uploaded your contact information to Instagram.{" "}
                <span className="text-blue-600 cursor-pointer">Learn More</span>
              </p>
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our <span className="text-blue-600">Terms</span>,{" "}
                <span className="text-blue-600">Privacy Policy</span> and{" "}
                <span className="text-blue-600">Cookies Policy</span>.
              </p>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 mt-2 rounded font-semibold hover:bg-blue-600 transition"
              >
                Sign up
              </button>
            </form>
          </div>
    
          <div className="border border-gray-300 p-4 w-96 bg-white mt-4 text-center">
            Have an account?{" "}
            <span className="text-blue-600 font-semibold cursor-pointer"><Link to="/">Login</Link></span>
          </div>
        </div>
      );
}

export default Signup