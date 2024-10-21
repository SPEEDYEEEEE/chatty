import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { searchOrg } from "../controllers/search.js";

const router = express.Router();

// Search route for organizations
router.get('/org', verifyToken, searchOrg);

export default router;
