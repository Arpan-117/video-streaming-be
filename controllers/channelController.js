import mongoose from "mongoose";
import ChannelModel from "../models/channelModel.js";
import UserModel from "../models/userModel.js";
import VideoModel from "../models/videoModel.js";

const createChannel = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { channelName, channelDescription } = req.body;
        const channelOwner = req.user.id;

        const newChannel = await ChannelModel.create([{
            channelName,
            channelDescription,
            owner: channelOwner
        }], { session });

        await UserModel.findByIdAndUpdate(channelOwner,
            { $push: { channels: newChannel[0]._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // const newChannel = new ChannelModel({
        //     channelName,
        //     channelDescription,
        //     owner: channelOwner
        // });
        // const savedChannel = await newChannel.save();

        return res.status(201).json({ message: "Channel created successfully", channel: newChannel[0] });
    } catch (err) {
        // return res.status(500).json({ message: "Internal server error - createChannel", error: err.message });
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        return res.status(500).json({ message: "Transaction failed - createChannel", error: err.message });
    }
}

const updateChannelDetails  = async (req, res) => {
    try {
        const channelId = req.params.channelId;
        const userId = req.user.id;
        const { channelName, channelDescription } = req.body;
        const channel = await ChannelModel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        if (userId !== channel.owner.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this channel" });
        }
        if (channelName && channelName.trim() !== "") {
            channel.channelName = channelName.trim();
        }
        if (channelDescription && channelDescription.trim() !== "") {
            channel.channelDescription = channelDescription.trim();
        }
        const updateChannel = await channel.save();
        return res.status(200).json({ message: "Channel details updated successfully", channel: updateChannel });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error - updateChannelDetails", error: err.message });
    }
}

// Get channel details (channel details and videos)
const getChannelDetails = async(req, res) => {
    try {
        const channel = req.params.channelId;
        const channelDetails = await ChannelModel.findById(channel);
        let details;
        if (!channelDetails) {
            return res.status(404).json({ message: "Channel not found" });
        }
        const videos = await VideoModel.find({ channel: channel });
        if (!videos) {
            details = { channelDetails, videos: [] };
        } else {
            details = { channelDetails, videos };
        }
        return res.status(200).json({ message: "Channel details fetched successfully", details });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error - getChannelDetails", error: err.message });
    }
}

export { createChannel, updateChannelDetails, getChannelDetails };