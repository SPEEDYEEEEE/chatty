import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import campaignRoutes from "./routes/campaign.js";
import searchRoutes from "./routes/search.js";
import notificationRoutes from "./routes/notifications.js"; // Import notification routes
import { register, registerOrganization } from "./controllers/auth.js"; // Import registerOrganization
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
// Register for Simple User with file upload
app.post("/auth/register", upload.single("picture"), register);
// Register for Organization User with file upload
app.post("/auth/register-organization", upload.single("picture"), registerOrganization);
// Create a post with file upload
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);           // Authentication routes for both Simple and Organization users
app.use("/users", userRoutes);          // User routes
app.use('/campaigns', campaignRoutes);  // Use the campaign routes
app.use("/posts", postRoutes);          // Post routes
app.use("/search", searchRoutes); // Register the search route
app.use("/notifications", notificationRoutes); // Notification routes

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    /* ADD DATA ONE TIME - Uncomment if needed for initial data population */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));