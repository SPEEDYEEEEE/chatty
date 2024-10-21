// models/Campaign.js

import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization', // Reference to the User model
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      required: false, // Optional if the image is not always required
    },
    posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false
    }]
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

const Campaign = mongoose.model('Campaign', CampaignSchema);

export {Campaign};
