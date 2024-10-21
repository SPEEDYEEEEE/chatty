// controllers/campaignController.js

import { Campaign } from "../models/Campaign.js";
import Post from "../models/Post.js";
import {User, Organization, FollowedOrganization} from "../models/User.js";

// Create a new campaign
export const createCampaign = async (req, res) => {
  const { userId, headline, description, picturePath } = req.body;
  console.log("Req Body is: ", req.body);
  const user = await Organization.findById(userId);

  try {
    const newCampaign = await Campaign.create({
      userId: userId,
      headline: headline,
      description: description,
      picturePath: picturePath,
    });

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create campaign' });
  }
};

// Fetch campaigns 
// export const getCampaigns = async (req, res) => {
//   try {
//     const campaigns = await Campaign.find().populate('userId', 'organizationName'); // You can modify fields to return
//     res.status(200).json(campaigns);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch campaigns' });
//   }
// };
export const getCampaigns = async (req, res) => {
  const userId = req.userId; // Extract the user ID from the token payload
  console.log("User ID is:", userId);
  try {
    // Check if the user is a simple user or organizational user
    const user = await User.findById(userId); // This may return null if the user is not in this collection
    
    if (!user) {
      // If not found, check the Organization collection
      const organization = await Organization.findById(userId);
      if (!organization) {
        return res.status(404).json({ message: 'User or Organization not found' });
      }

      // Now you can use the organization object
      // For organizational users: fetch their own campaigns
      const campaigns = await Campaign.find({ userId }) // Assuming userId here is the org's ID
        .populate('userId', 'organizationName'); // Populate organization name
      return res.status(200).json(campaigns);
    }

    // For simple users: fetch campaigns from followed organizations
    if (user.role === "user") {
      const followedOrganizations = await FollowedOrganization.find({ userId })
        .populate('organizationId'); // Populate organization details

      const organizationIds = followedOrganizations.map(org => org.organizationId._id); // Get the IDs
      console.log("Organization IDs are:", organizationIds);

      const campaigns = await Campaign.find({ userId: { $in: organizationIds } })
        .populate('userId', 'organizationName'); // Populate organization name

      return res.status(200).json(campaigns);
    }

    res.status(400).json({ message: 'Invalid user role' });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
};


export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("posts");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPostToCampaign = async (req, res) => {
  try {
    const { postId } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    campaign.posts.push(postId);
    const updatedCampaign = await campaign.save();

    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};