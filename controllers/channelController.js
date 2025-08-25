import ChannelModel from "../models/channelModel.js";

const createChannel = async (req, res) => {
    try {
        const { channelName, channelDescription } = req.body;
        const channelOwner = req.user.id;

        const newChannel = new ChannelModel({
            channelName,
            channelDescription,
            owner: channelOwner
        });
        const savedChannel = await newChannel.save();
        return res.status(201).json(savedChannel);
    } catch(err) {
        return res.status(500).json({ message: "Internal server error - createChannel", error: err.message });
    }
}

export { createChannel };