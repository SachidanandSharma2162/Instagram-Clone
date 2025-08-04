import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/userContext"; // Update path as needed

const Login = () => {
  const { user, setUser, loading, isAuthenticated, setIsAuthenticated, url } =
    useUser(); // From context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${url}/users/login`, formData, {
        withCredentials: true,
      });

      setUser(res.data.user); // Set user in context
      setIsAuthenticated(true);
      navigate(`/user/${res.data.user.username}`); // Redirect to home page or dashboard
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="border border-gray-300 p-8 bg-white rounded-md">
          <img
            src="/images/instaLogo.png"
            alt="Instagram"
            className="w-full object-contain h-40"
          />
          <p className="text-center text-sm text-gray-500 mb-4">
            Log in to see photos and videos from your friends.
          </p>
          <form onSubmit={submitHandler} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-gray-50"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded bg-gray-50"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold"
            >
              Log in
            </button>
            {message && (
              <p className="text-red-500 text-center mt-2">{message}</p>
            )}
          </form>
        </div>
        <div className="border p-4 mt-4 text-center bg-white rounded-md text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
