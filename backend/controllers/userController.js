import userModel from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt"
import validator from "validator"
import { uploadFileOnCloudinary } from '../utils/cloudinary.js'; 


const signupUser = async (req, res) => {
  try {
    const { email, password, fullName, username } = req.body;
    if (!email || !password || !fullName || !username) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({ error: "Please enter an valid email!" });
    }
    if(password.Length<8){
        return res.status(400).json({ error: "Please enter a strong password!" });

    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists. Please login!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await userModel.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(createdUser);
    res.cookie("token", token);
    req.session.user=createdUser;
    res.status(201).json({ message: "Signup successful!", user: createdUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter all fields!" });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // Generate and set token
    const token = generateToken(existingUser);
    res.cookie("token", token);
    req.session.user=existingUser;

    // Send success response
    res.status(200).json({ message: "Login successful!", user: existingUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error!" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("token", {
      sameSite: "strict", // prevent CSRF
    });

    // Destroy the session (if using express-session)
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Logout failed!" });
      }

      res.status(200).json({ message: "Logout successful!" });
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ error: "Server error!" });
  }
};

const getLoggedInUser=async(req,res)=>{
  try {
    const user=req.session.user;
    if(!user){
      return res.status(401).json({error:"Unauthorized access!"})
    }
    res.status(200).json({user})
  } catch (error) {
    
  }
}

const getAllUsers=async(req,res)=>{
  const query = req.query.query;
  try {
    const users = await userModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ]
    }).limit(10).select('_id username fullName profilePic');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
}

const updateProfile=async(req,res)=>{
  try {
    const userId = req.user._id; // Assuming you're using a middleware to attach user to req
    const { bio, gender } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        bio,
        gender,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
const updateProfilePic = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadFileOnCloudinary(req.file.path);

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return res.status(500).json({ error: "Failed to upload to Cloudinary." });
    }

    // Save the profile picture URL
    user.profilePic = cloudinaryResult.secure_url;
    await user.save();

    res.status(200).json({ message: "Profile picture updated!", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error while updating profile picture." });
  }
};

export {signupUser, loginUser, logoutUser,getLoggedInUser,getAllUsers,updateProfile,updateProfilePic}