import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// VIDEO ROUTES
// Upload/Create Video
router.post("/upload", verifyToken)

export default router;