import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// USER ROUTES
// Register User
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Delete Account (only user can delete)
// Update Account Details (only user can update)

export default router;