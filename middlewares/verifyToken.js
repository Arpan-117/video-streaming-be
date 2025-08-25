import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] === "YTC") {
        jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET,
        function(err, decodedToken) {
            if (err) {
                return res.status(403).json({ message: "Invalid token", error: err.message });
            }
            UserModel.findById(decodedToken.id)
            .then((user) => { 
                req.user = user;
                next();
             })
             .catch((err) => {
                return res.status(500).json({ message: "Internal server error - verifyToken", error: err.message });
             })
        })
    } else {
        return res.status(404).json({ message: "Token not found" });
    }
}

export { verifyToken };