import express from "express"
import {Router} from "express"
import { isLoggedIn } from "../middleware/isLoggedIn.js"
import upload from "../config/multerConfig.js"
const postRouter =Router()
import { createMyPost, explorePosts,getUsersPosts,getAllPosts} from "../controllers/postController.js"

postRouter.post('/createpost',isLoggedIn,upload.single("file"),createMyPost)
postRouter.get('/explore',isLoggedIn,explorePosts)
postRouter.get('/userpost',isLoggedIn,getUsersPosts)
postRouter.get('/allposts',isLoggedIn,getAllPosts);
export default postRouter