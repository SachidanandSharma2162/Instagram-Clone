import express from "express";
import { Router } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  getAllUsers,
  updateProfile,
  updateProfilePic
} from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import upload from "../config/multerConfig.js";
const userRouter = Router();

userRouter.get("/me", isLoggedIn, getLoggedInUser);
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isLoggedIn, logoutUser);
userRouter.get("/search", isLoggedIn, getAllUsers);
userRouter.put("/update", isLoggedIn, updateProfile);
userRouter.put("/update-profile-pic", isLoggedIn, upload.single("profilePic"), updateProfilePic);
export default userRouter;
