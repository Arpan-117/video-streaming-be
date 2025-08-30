import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadVideo, editVideoDetails } from "../controllers/videoController.js";

const router = express.Router();

// VIDEO ROUTES
// Upload/Create Video
router.post("/video/upload", verifyToken, uploadVideo);

// Delete Video (only video owner can delete)

// Update Video Details (only video owner can update)
router.put("/video/update/:videoId", verifyToken, editVideoDetails);

// Get Video and Details(comments, likes, dislikes, views)

export default router;