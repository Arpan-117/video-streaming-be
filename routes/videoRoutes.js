import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// VIDEO ROUTES
// Upload/Create Video
router.post("/upload", verifyToken);

// Delete Video (only video owner can delete)
// Update Video Details (only video owner can update)
// Get Video and Details(comments, likes, dislikes, views)

export default router;