import express from "express";
import { getFeedPosts, getUserPosts, likePost, addComment, createPost, getPostsByCampaign} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

import Post from "../models/Post.js"
import Notification from "../models/Notification.js";
import {User} from "../models/User.js";

const router = express.Router();

router.post("/posts", createPost); // Create a new post

router.get("/:campaignId/posts", verifyToken, getPostsByCampaign);

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* ADD COMMENT */
router.post("/:id/comment", verifyToken, addComment);

export default router;

