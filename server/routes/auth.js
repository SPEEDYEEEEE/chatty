// import express from "express";
// import { login } from "../controllers/auth.js";

// const router = express.Router();

// router.post("/login", login);

// export default router;

import express from "express";
import {
  register,
  login,
  registerOrganization,
  // loginOrganization
} from "../controllers/auth.js"; // Import all necessary controllers

const router = express.Router();

// Routes for Simple User
router.post("/register", register); // Register a Simple User
router.post("/login", login);       // Login a Simple User

// Routes for Organization User
router.post("/register-organization", registerOrganization); // Register an Organization User
router.post("/login-organization", login);       // Login an Organization User

export default router;
