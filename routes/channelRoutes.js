import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { createChannel, getChannelDetails } from "../controllers/channelController.js";

const router = express.Router();

// CHANNEL ROUTES
// Create Channel
router.post("/create-channel", verifyToken, createChannel);

// Delete Channel (only channel owner can delete)
// Update Channel Details (only channel owner can update)

// Get all videos from channel (for channel owner and other users)
router.get("/channel-details/:channelId", getChannelDetails);

// Delete all videos from channel (only channel owner can delete)

export default router;