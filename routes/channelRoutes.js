import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { createChannel } from "../controllers/channelController.js";

const router = express.Router();

// CHANNEL ROUTES
// Create Channel
router.post("/create-channel", verifyToken, createChannel);

export default router;