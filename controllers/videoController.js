import VideoModel from "../models/videoModel.js";

const uploadVideo = async (req, res) => {
    const { title, videoUrl, description, channel } = req.body;
    const videoUploader = await req.user.id;
    return videoUploader;
}