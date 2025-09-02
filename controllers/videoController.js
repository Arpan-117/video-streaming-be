import VideoModel from "../models/videoModel.js";

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

export { uploadVideo, editVideoDetails }