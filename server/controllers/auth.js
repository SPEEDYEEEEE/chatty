import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Organization } from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

      console.log("Registering Simple User", req.body);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* REGISTER ORGANIZATION USER */
export const registerOrganization = async (req, res) => {
  try {
    const {
      organizationName,
      email,
      password,
      picturePath,
      location,
      website,
      categories,
      otherCategory,
      projects,
    } = req.body;
    
    console.log(req.body);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newOrganization = new Organization({
      organizationName,
      email,
      password: passwordHash,
      picturePath,
      location,
      website,
      categories,
      otherCategory,
      projects,
    });
    console.log(password);

    const savedOrganization = await newOrganization.save();
    res.status(201).json(savedOrganization);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN FOR BOTH SIMPLE AND ORGANIZATION USERS */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email belongs to a Simple User
    let user = await User.findOne({ email });
    
    // If not found, check if it belongs to an Organization User
    if (!user) {
      user = await Organization.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User/Organization does not exist." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password; // Remove the password before sending the user data

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN ORGANIZATION USER */
// export const loginOrganization = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const organization = await Organization.findOne({ email: email });
//     if (!organization) return res.status(400).json({ msg: "Organization does not exist. " });

//     const isMatch = await bcrypt.compare(password, organization.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

//     const token = jwt.sign({ id: organization._id }, process.env.JWT_SECRET);
//     delete organization.password;
//     res.status(200).json({ token, organization });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
/* LOGGING IN */
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) return res.status(400).json({ msg: "User does not exist. " });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     delete user.password;
//     res.status(200).json({ token, user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };