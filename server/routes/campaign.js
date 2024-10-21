// routes/campaignRoutes.js

import express from 'express';
import { addPostToCampaign, createCampaign, getCampaignById, getCampaigns} from '../controllers/campaign.js';
import { verifyToken } from '../middleware/auth.js'; // Assuming you have a middleware for token verification

const router = express.Router();

// Create a new campaign
router.post("/", verifyToken, createCampaign); // Create a campaign

// Get all campaigns (optional, you can add this if needed)
router.get("/", verifyToken, getCampaigns); // Get all campaigns

router.get("/campaigns/:id", getCampaignById); // Get a specific campaign

router.put("/campaigns/:id/posts", addPostToCampaign); // Add a post to a campaign

// router.get('/:campaignId/posts', verifyToken, getPostsByCampaignId);

export default router;
