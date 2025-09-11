import mongoose from "mongoose";
import VideoModel from "../models/videoModel.js";
import CommentsModel from "../models/commentsModel.js";

const getAllComments = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const comments = await CommentsModel.find({ videoId })
        .populate("author", "username")
        .sort({ date: -1 });
        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "Comments not found" });
        }
        return res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error - getAllComments", error: err.message });
    }
}

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

export { getAllComments, postComment };