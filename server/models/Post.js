import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: String,
  lastName: String,
  description: String,
  picturePath: String,
  userPicturePath: String,
  likes: { type: Map, of: Boolean },
  comments: [commentSchema],
  tags: [String], // Tags related to the post
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }], // Link to campaigns
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
