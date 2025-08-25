import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const validPassword = bcrypt.compareSync(password, existingUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "60m" });
        return res.status(200).json({
            user: { id: existingUser._id, username: existingUser.username },
            accessToken: token
        });
    } catch(err) {
        return res.status(500).json({ message: "Internal server error while logging in user", error: err.message });
    }
} 

export { registerUser, loginUser };