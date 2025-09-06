import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadVideo, editVideoDetails, deleteVideo, viewVideo, watchVideo, likeVideo, dislikeVideo } from "../controllers/videoController.js";

const router = express.Router();

// VIDEO ROUTES
// Upload/Create Video
router.post("/video/upload", verifyToken, uploadVideo);

// Delete Video (only video owner can delete)
router.delete("/video/delete/:videoId", verifyToken, deleteVideo)

// Watch Video without login(comments, likes, dislikes, views)
router.patch("/video/view/:videoId", viewVideo);

// Watch video as logged in user
router.patch("/video/watch/:videoId", verifyToken, watchVideo);

// Edit or Update Video Details (only video owner can update)
router.put("/video/update/:videoId", verifyToken, editVideoDetails);

// Like/unLike Video
router.put("/video/like/:videoId", verifyToken, likeVideo);

// Dislike/unDislike Video
router.put("/video/dislike/:videoId", verifyToken, dislikeVideo);



export default router;