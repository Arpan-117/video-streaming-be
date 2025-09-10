import mongoose from "mongoose";
import VideoModel from "../models/videoModel";
import CommentsModel from "../models/commentsModel";

const postComment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.user.id;
        const videoId = req.params.videoId;
        const { text } = req.body;
        const video = await VideoModel.findById(videoId);
        if (!video) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Video not found" });
        }
        if (!text || text.trim() === "") {
            session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Comment cannot be empty or blank" });
        }
        const newComment = new CommentsModel({
            videoId,
            author: userId,
            text
        });
        const savedComment = await newComment.save({ session });
        await VideoModel.findByIdAndUpdate(videoId,
            { $push: { comments: savedComment._id } },
            { session }
        );
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ message: "Comment posted successfully", savedComment });
    } catch (err) {
        session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error - postComment", error: err.message });
    }
}