import mongoose from "mongoose";
import postModel from "./postModel.js"; // Import Post model to delete user's posts

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Custom", "Prefer not to say", ""], // Optional string enum
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to delete all posts created by the user
userSchema.pre("remove", async function (next) {
  try {
    await postModel.deleteMany({ _id: { $in: this.posts } });
    next();
  } catch (err) {
    next(err);
  }
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
