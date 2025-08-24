import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

// USER ROUTES
// Register User
router.post("/register", registerUser);

export default router;