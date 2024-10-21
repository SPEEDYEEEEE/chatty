import { Campaign } from "../models/Campaign.js";
import Post from "../models/Post.js";
import {User, Organization} from "../models/User.js";

//CREATE
// export const createPost = async (req, res) => {
//   try {
//     const { userId, description, picturePath, tags, campaigns } = req.body;
//     console.log(userId, description, picturePath, tags, campaigns);
//     const user = await Organization.findById(userId);

//     // Parse tags and campaigns if they are sent as JSON strings
//     const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
//     const parsedCampaigns = typeof campaigns === 'string' ? JSON.parse(campaigns) : campaigns;

//     const newPost = new Post({
//       userId,
//       // firstName: user.firstName,
//       // lastName: user.lastName,
//       organizationName: user.organizationName,
//       location: user.location,
//       description,
//       userPicturePath: user.picturePath,
//       picturePath,
//       tags: parsedTags,
//       campaigns: parsedCampaigns,
//       likes: {},
//       comments: [],
//     });
//     await newPost.save();

//     const post = await Post.find();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(409).json({ message: err.message });
//   }
// };
export const createPost = async (req, res) => {
  try {
    const { userId, organizationName, location, description, picturePath, tags, userPicturePath } = req.body;
    console.log(req.body);

    // Parse campaigns since it's received as a JSON string
    const campaigns = JSON.parse(req.body.campaigns);
    console.log(campaigns);
    const newPost = new Post({
      userId,
      organizationName,
      location,
      description,
      picturePath,
      tags,
      userPicturePath,
      likes: new Map(), // Initialize as an empty Map
      campaigns
    });

    const savedPost = await newPost.save();

    // Add the post to the related campaigns
    console.log("Campaigns to update:", campaigns);
    console.log("Post ID to add:", savedPost._id);
    const result = await Campaign.updateMany(
      { _id: { $in: campaigns } },
      { $push: { posts: savedPost._id } }
    );
    console.log("Update result:", result);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);  // Log the error
    res.status(500).json({ message: error.message });
  }
};


// Controller to get posts related to a specific campaign
export const getPostsByCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    // Find posts that are associated with the campaign
    const posts = await Post.find({ campaigns: campaignId })
      .populate("userId", "firstName lastName") // Optional: populate user info
      .sort({ createdAt: -1 }); // Sort by newest first

    // Return posts related to the campaign
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching campaign posts:", error);
    res.status(500).json({ message: "Failed to fetch posts for this campaign" });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'comments.userId',
        select: 'firstName lastName', // Fetch only firstName and lastName
      })
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId })
      .populate({
        path: 'comments.userId',
        select: 'firstName lastName', // Fetch only firstName and lastName
      })
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    console.log("Request received:", req.method, req.url);
    const { id } = req.params;
    const { userId } = req.body;
    console.log("Post ID:", id);
    console.log("User ID:", userId);
    
    const post = await Post.findById(id);
    if (!post) {
      console.error("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure likes is a Map
    if (!post.likes) {
      post.likes = new Map();
    }

    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error in likePost route:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // post ID
    const { userId, text } = req.body;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      userId, // store the userId
      text,
      createdAt: new Date(),
      firstName: user.firstName, // store user's first name
      lastName: user.lastName, // store user's last name
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error adding comment:", err); // Debugging log
    res.status(404).json({ message: err.message });
  }
};


/* ADD CAMPAIGN */
export const addCampaignToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { campaign } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.campaigns.push(campaign);
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
