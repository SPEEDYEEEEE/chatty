import mongoose from 'mongoose';

//Simple User
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    role: {
      type: String,
      required: false,
      default: "user"
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);
const User = mongoose.model('User', UserSchema);

//Organization User
const OrganizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    role: {
      type: String,
      required: false,
      default: "org"
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    categories: [{
      type: String,
      required: true,
    }],
    otherCategory: {
      type: String,
      default: "",
    },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Assuming you have a 'Project' model for their projects
    }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
const Organization = mongoose.model('Organization', OrganizationSchema);

//Followed Organization Users
const FollowedOrganizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the Organization schema
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
  followedAt: {
    type: Date,
    default: Date.now, // Store the timestamp when the user followed the organization
  },
});
const FollowedOrganization = mongoose.model("FollowedOrganization", FollowedOrganizationSchema);

export { User, Organization, FollowedOrganization};
