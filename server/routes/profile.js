import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import {
  getData,
  updateData,
  updatePassword,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", verifyToken, getData);
router.put("/", verifyToken, updateData);
router.put("/password", verifyToken, updatePassword);

export default router;
