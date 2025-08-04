import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);       // Authenticated user
  const [loading, setLoading] = useState(true);  // Loading status
  const url="http://localhost:4000"
  // Fetch current user on initial load
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${url}/users/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  // Context value
  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    url,
    setIsAuthenticated
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
