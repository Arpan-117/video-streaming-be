import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new UserModel({
            username,
            email,
            password: bcrypt.hashSync(password, 10)
        });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch(err) {
        return res.status(500).json({ message: "Internal server error while registering user", error: err.message });
    }
}

export { registerUser };