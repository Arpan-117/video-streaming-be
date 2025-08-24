import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    videoId: {type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    date: { type: Date, default: Date.now },
});

const CommentsModel = mongoose.model("Comment", commentSchema);

export default CommentsModel;