import mongoose from "mongoose";
import ChannelModel from "../models/channelModel.js";
import UserModel from "../models/userModel.js";

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

export { createChannel };