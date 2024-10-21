import { Campaign } from "../models/Campaign.js";
import {User, Organization, FollowedOrganization} from "../models/User.js";

// import { User, Organization } from "../models/User.js";

// /* Helper function to identify user type */
// const getUserType = async (id) => {
//   const user = await User.findById(id);
//   if (user) return "user";
//   const organization = await Organization.findById(id);
//   if (organization) return "organization";
//   return null;
// };

// /* READ - Get user or organization by ID */
// export const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userType = await getUserType(id);
    
//     if (!userType) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const data = userType === "user" 
//       ? await User.findById(id)
//       : await Organization.findById(id);

//     res.status(200).json(data);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

// /* READ - Get friends (for simple users) or projects (for organizations) */
// export const getUserFriends = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userType = await getUserType(id);

//     if (userType === "user") {
//       const user = await User.findById(id);

//       const friends = await Promise.all(
//         user.friends.map((id) => User.findById(id))
//       );
//       const formattedFriends = friends.map(
//         ({ _id, firstName, lastName, location, picturePath }) => {
//           return { _id, firstName, lastName, location, picturePath };
//         }
//       );
//       res.status(200).json(formattedFriends);
//     } else if (userType === "organization") {
//       const organization = await Organization.findById(id).populate("projects");
      
//       const formattedProjects = organization.projects.map(
//         ({ _id, projectName, category, status }) => {
//           return { _id, projectName, category, status };
//         }
//       );
//       res.status(200).json(formattedProjects);
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

// /* UPDATE - Add or remove friend (for simple users only) */
// export const addRemoveFriend = async (req, res) => {
//   try {
//     const { id, friendId } = req.params;
//     const userType = await getUserType(id);

//     if (userType !== "user") {
//       return res.status(403).json({ message: "Only simple users can have friends" });
//     }

//     const user = await User.findById(id);
//     const friend = await User.findById(friendId);

//     if (user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id) => id !== friendId);
//       friend.friends = friend.friends.filter((id) => id !== id);
//     } else {
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }
//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, location, picturePath }) => {
//         return { _id, firstName, lastName, location, picturePath };
//       }
//     );

//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

/* READ */
// export const getUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the user first
    let user = await User.findById(id);

    // If no user is found, check for organization
    if (!user) {
      const organization = await Organization.findById(id);
      if (organization) {
        return res.status(200).json(organization);
      }
    }

    // If a user is found or an organization was found, return the response
    if (user) {
      return res.status(200).json(user);
    } else {
      // If neither user nor organization is found, send 404
      return res.status(404).json({ message: "No user or organization found with this ID" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const getUserFriends = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, location, picturePath }) => {
//         return { _id, firstName, lastName, location, picturePath };
//       }
//     );
//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the user first
    let user = await User.findById(id);

    // If no user is found, check for organization
    if (!user) {
      const organization = await Organization.findById(id);
      if (organization) {
        return res.status(200).json({ message: "Organizations don't have friends" });
      }
    }

    // If a user is found, proceed to get the user's friends
    if (user) {
      const friends = await Promise.all(
        user.friends.map((friendId) => User.findById(friendId))
      );
      
      // Format the friends data
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, location, picturePath }) => {
          return { _id, firstName, lastName, location, picturePath };
        }
      );
      
      return res.status(200).json(formattedFriends);
    } else {
      // If neither user nor organization is found, return 404
      return res.status(404).json({ message: "No user or organization found with this ID" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Controller function to get all registered organizations
export const getAllOrganizations = async (req, res) => {
  try {
    // Fetch all organizations from the database
    const organizations = await Organization.find({ role: "org" });
    
    // Log the fetched organizations to the console for debugging
    console.log("Fetched Organizations:", organizations);

    // Return the list of organizations in the response
    res.status(200).json(organizations);
  } catch (error) {
    // Log any error that occurs
    console.error("Error fetching organizations:", error);
    
    // Return a 500 status with an error message
    res.status(500).json({ message: 'Server Error, unable to fetch organizations' });
  }
};

// Controller for organization users who are followed
export const followOrganization = async (req, res) => {
  try {
    const { id } = req.params; // Organization ID
    const userId = req.user.id; // Correctly access user ID

    // Log for debugging
    console.log("User ID:", userId); // This should now log the correct user ID

    // Find the organization
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if the user is already following the organization
    const isAlreadyFollowing = await FollowedOrganization.findOne({
      userId,
      organizationId: id,
    });

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: "Already following" });
    }

    // Check if userId is defined before creating FollowedOrganization
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Save the organization to the FollowedOrganization schema
    const followedOrganization = new FollowedOrganization({
      userId, // Correctly setting userId
      organizationId: id,
      organizationName: organization.organizationName, // Include organization name
    });
    await followedOrganization.save();

    // Ensure followers array is defined before pushing
    if (!Array.isArray(organization.followers)) {
      organization.followers = []; // Initialize if not defined
    }
    
    // Update the followers array in the organization model
    organization.followers.push(userId);
    await organization.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following organization:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Controller to get organizations followed by a specific user
export const getFollowedOrganizations = async (req, res) => {
  try {
    const { id } = req.params; // Simple user ID from the URL

    // Find all organizations that the user follows from FollowedOrganization collection
    const followedOrganizations = await FollowedOrganization.find({ userId: id })
      .populate('organizationId', 'organizationName') // Populate organization details

    // Return the followed organizations with relevant fields
    res.status(200).json(followedOrganizations.map(follow => follow.organizationId));
  } catch (error) {
    console.error("Error fetching followed organizations:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Controller to get organizations Un-followed by a specific user

export const followUnfollowOrganization = async (req, res) => {
  try {
    const { orgId } = req.params; // Organization ID
    const userId = req.user.id; // Correctly access user ID

    // Remove from FollowedOrganization
    await FollowedOrganization.findOneAndDelete({
      userId,
      organizationId: orgId,
    });

    // Update the organization to remove userId from followers
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    organization.followers = organization.followers.filter(follower => follower.toString() !== userId);
    await organization.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing organization:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Route to get organization details along with its campaigns
export const orgUserProfile = async (req, res) => {
  const { orgId } = req.params;
  try {
    // Find the organization by its ID
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Fetch the campaigns for this organization
    const campaigns = await Campaign.find({ userId: orgId });

    res.status(200).json({ organization, campaigns });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching organization details' });
  }
};
