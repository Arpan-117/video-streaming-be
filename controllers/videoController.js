import VideoModel from "../models/videoModel.js";

const uploadVideo = async (req, res) => {
    try {
        const { title, videoUrl, description, channel } = req.body;
        const videoUploader = await req.user.id;
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

export { uploadVideo}