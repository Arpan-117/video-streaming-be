import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { createChannel } from "../controllers/channelController.js";

const router = express.Router();

// CHANNEL ROUTES
// Create Channel
router.post("/create-channel", verifyToken, createChannel);

// Delete Channel
// Update Channel Details
// Get all videos from channel
// Delete all videos from channel

export default router;