import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "OK", user: req.user });
});

export default router;
