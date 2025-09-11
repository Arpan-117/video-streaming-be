import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getAllComments, postComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// Get all comments on video
router.get("/comments/:videoId", getAllComments);

// Post a comment on video
router.post("/comment/:videoId", verifyToken, postComment);

// Delete comment on video
router.delete("/delete-comment/:commentId", verifyToken, deleteComment);

// Update comment on video

export default router;