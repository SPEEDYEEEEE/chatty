import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllOrganizations,
  followOrganization,
  getFollowedOrganizations,
  followUnfollowOrganization,
  orgUserProfile,
  // getFollowedOrganizations,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//Route for getting all Organization users
router.get('/organizations', getAllOrganizations);

// Follow an organization
router.patch("/:id/follow", verifyToken, followOrganization);

// Route for fetching followed organizations for a specific user
router.get('/:id/followedOrganizations', verifyToken, getFollowedOrganizations);

//UnFollow an organization
router.delete('/:userId/unfollow/:orgId', verifyToken, followUnfollowOrganization);

// Route to get organization details along with its campaigns
router.get('/organizations/:orgId', verifyToken, orgUserProfile);

/*----------------------------------------------------------------*/

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);


export default router;
