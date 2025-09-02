import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadVideo, editVideoDetails, viewVideo, likeVideo } from "../controllers/videoController.js";

const router = express.Router();

// VIDEO ROUTES
// Upload/Create Video
router.post("/video/upload", verifyToken, uploadVideo);

// Delete Video (only video owner can delete)

// Get Video and Details(comments, likes, dislikes, views)
router.patch("/video/view/:videoId", viewVideo);

// Update Video Details (only video owner can update)
router.put("/video/update/:videoId", verifyToken, editVideoDetails);

// Like/unLike Video
router.put("/video/like/:videoId", verifyToken, likeVideo);

// Dislike/unDislike Video



export default router;