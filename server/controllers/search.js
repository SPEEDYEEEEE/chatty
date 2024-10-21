import { Organization } from "../models/User.js";

// Search for organizations by name
export const searchOrg = async (req, res) => {
  try {
    const { name } = req.query; // Fetch the name from the query params
    const organizations = await Organization.find({
      organizationName: { $regex: name, $options: 'i' }, // Case-insensitive search
    });
    res.status(200).json(organizations); // Return found organizations as JSON
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
