import postModel from '../models/postModel.js'
import userModel from '../models/userModel.js';
import { uploadFileOnCloudinary } from '../utils/cloudinary.js'; 
const createMyPost=async(req,res)=>{
    try {
    const { caption } = req.body;
    console.log(req.body);
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadFileOnCloudinary(req.file.path);

    if (!cloudinaryResult) {
      return res.status(500).json({ error: "Failed to upload to Cloudinary" });
    }

    // Save post in DB
    const newPost = await postModel.create({
      user: req.user._id, // make sure authentication middleware sets req.user
      caption,
      mediaUrl: cloudinaryResult.secure_url,
      mediaType: cloudinaryResult.resource_type, // image/video
    });
    const user=req.user
    user.posts.push(newPost._id);
    await user.save();
    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

const explorePosts=async(req,res)=>{
    try {
    const posts = await postModel.find()
      .populate("user", "username fullName profilePic")
      .sort({ createdAt: -1 });
    //   console.log(posts);
      
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching explore posts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getUsersPosts=async(req,res)=>{
    try {
    let user=req.user
    const posts = await postModel.find({ user: user._id });
    console.log(posts);
    res.status(200).json({ posts });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
const getAllPosts=async(req,res)=>{
  try {
    const posts = await postModel.find()
      .populate("user", "username profilePic")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getAllPosts:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export {createMyPost,explorePosts,getUsersPosts,getAllPosts}
