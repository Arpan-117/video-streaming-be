import mongoose from "mongoose";
import VideoModel from "../models/videoModel.js";
import UserModel from "../models/userModel.js";

const uploadVideo = async (req, res) => {
    try {
        const { title, videoUrl, description, channel } = req.body;
        const videoUploader = req.user.id;
        const newVideo = new VideoModel({
            title,
            videoUrl,
            description,
            channel,
            uploader: videoUploader
        });
        const savedVideo = await newVideo.save();
        return res.status(201).json({ message: "Video uploaded successfully", video: savedVideo });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error - uploadVideo", error: err.message });
    }
}

const editVideoDetails = async (req, res) => {
    try {
        const { title, thumbnailUrl, videoUrl, description } = req.body;
        const videoId = req.params.videoId;
        const userId = req.user.id;
        // let newTitle, newThumbnailUrl, newVideoUrl, newDescription;
        // if (uploader !== userId) {
        //     return res.status(403).json({ message: "You are not authorized to edit this video" });
        // }
        const videoToEdit = await VideoModel.findById(videoId);
        if (!videoToEdit) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (videoToEdit.uploader.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to edit this video" });
        }
        // if (title.trim() === "" || videoUrl.trim() === "" || description.trim() === "") {
        //     // return res.status(400).json({ message: "Please provide all the details" });
        //     newTitle = videoToEdit.title;
        //     newVideoUrl = videoToEdit.videoUrl;
        //     newDescription = videoToEdit.description;
        // }
        // if (title.trim() === "") {
        //     newTitle = videoToEdit.title;
        // } else {
        //     newTitle = title;
        // }
        // if (videoUrl.trim() === "") {
        //     newVideoUrl = videoToEdit.videoUrl;
        // } else {
        //     newVideoUrl = videoUrl;
        // }
        // if (description.trim() === "") {
        //     newDescription = videoToEdit.description;
        // } else {
        //     newDescription = description;
        // }
        // if (thumbnailUrl.trim() === "") {
        //     newThumbnailUrl = videoToEdit.thumbnailUrl;
        // } else {
        //     newThumbnailUrl = thumbnailUrl;
        // }
        // const newDetails = new VideoModel({
        //     title: newTitle,
        //     thumbnailUrl: newThumbnailUrl,
        //     videoUrl: newVideoUrl,
        //     description: newDescription,
        // });
        // const updatedVideo = await VideoModel.findByIdAndUpdate(videoId, newDetails);
        if (title && title.trim() !== "") {
            videoToEdit.title = title;
        }
        if (thumbnailUrl && thumbnailUrl.trim() !== "") {
            videoToEdit.thumbnailUrl = thumbnailUrl;
        }
        if (videoUrl && videoUrl.trim() !== "") {
            videoToEdit.videoUrl = videoUrl;
        }
        if (description && description.trim() !== "") {
            videoToEdit.description = description;
        }
        const updatedVideo = await videoToEdit.save();
        return res.status(200).json({ message: "Video details updated successfully", video: updatedVideo });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error - editVideoDetails", error: err.message });
    }
}

const deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id;
        const video = await VideoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (userId !== video.uploader.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this video" });
        }
        const deletedVideo = await VideoModel.findByIdAndDelete(videoId);
        return res.status(200).json({ message: "Video deleted successfully", deletedVideo });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error - deleteVideo", error: err.message });
    }
}

const viewVideo = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const videoId = req.params.videoId;
        const video = await VideoModel.findById(videoId);
        if (!video) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Video not found" });
        }
        const viewedVideo = await VideoModel.findByIdAndUpdate(videoId,
            { $inc: { views: 1 } },
            { returnOriginal: false },
            { session }
        );
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Video viewed successfully", viewedVideo });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error - viewVideo", error: err.message });
    }
}

const watchVideo = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id;
        let isLiked, isDisliked;
        const video = await VideoModel.findById(videoId);
        if (!video) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Video not found" });
        }
        const viewedVideo = await VideoModel.findByIdAndUpdate(videoId,
            { $inc: { views: 1 } },
            { returnOriginal: false },
            { session }
        );
        const userDetails = await UserModel.findById(userId);
        const liked = userDetails.likedVideos.includes(videoId);
        const disliked = userDetails.dislikedVideos.includes(videoId);
        if (liked) {
            isLiked = true;
        } else {
            isLiked = false;
        }
        if (disliked) {
            isDisliked = true;
        } else {
            isDisliked = false;
        }
        const details = { viewedVideo, isLiked, isDisliked };
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Video viewed successfully", details });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error - viewVideo", error: err.message });
    }
}

// Working, just need to return the latest video details after update
const likeVideo = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id;
        const video = await VideoModel.findById(videoId);
        if (!video) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Video not found" });
        }
        // check if user already liked the video
        let updatedVideo;
        const userDetails = await UserModel.findById(userId);
        const likedVideo = await userDetails.likedVideos.includes(videoId);
        if (likedVideo) {
            await UserModel.findByIdAndUpdate(userId,
                { $pull: { likedVideos: videoId } },
                { session }
            );
            updatedVideo = await VideoModel.findByIdAndUpdate(videoId,
                { $inc: { likes: -1 } },
                { returnOriginal: false },
                { session }
            );
        } else {
            await UserModel.findByIdAndUpdate(userId,
                { $push: { likedVideos: videoId } },
                { session }
            );
            updatedVideo = await VideoModel.findByIdAndUpdate(videoId,
                { $inc: { likes: 1 } },
                { returnOriginal: false },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Video liked successfully", updatedVideo });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error - likeVideo", error: err.message });
    }
}

const dislikeVideo = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const videoId = req.params.videoId;
        const userId = req.user.id;
        const video = await VideoModel.findById(videoId);
        if (!video) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Video not found" });
        }
        // check if user already disliked the video
        let updatedVideo;
        const userDetails = await UserModel.findById(userId);
        const dislikedVideo = await userDetails.dislikedVideos.includes(videoId);
        if (dislikedVideo) {
            await UserModel.findByIdAndUpdate(userId,
                { $pull: { dislikedVideos: videoId } },
                { session }
            );
            updatedVideo = await VideoModel.findByIdAndUpdate(videoId,
                { $inc: { dislikes: -1 } },
                { returnOriginal: false },
                { session }
            );
        } else {
            await UserModel.findByIdAndUpdate(userId,
                { $push: { dislikedVideos: videoId } },
                { session }
            );
            updatedVideo = await VideoModel.findByIdAndUpdate(videoId,
                { $inc: { dislikes: 1 } },
                { returnOriginal: false },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Video disliked successfully", updatedVideo });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error - dislikeVideo", error: err.message });
    }
}

export { uploadVideo, editVideoDetails, deleteVideo, viewVideo, watchVideo, likeVideo, dislikeVideo }