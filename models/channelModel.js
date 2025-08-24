import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName: {type: String, required: true},
    channelDescription: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    subscribers: {type: Number, default: 0},
    avatarUrl: {type: String},
    bannerUrl: {type: String}
});

const ChannelModel = mongoose.model("Channel", channelSchema);

export default ChannelModel;