import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import {
  getAvailableTimes,
  createAppointment,
  getUserAppointments,
  getServices,
} from "../controllers/appointmentsController.js";

const router = express.Router();

router.get("/available-times", verifyToken, getAvailableTimes);
router.get("/services", verifyToken, getServices);
router.post("/", verifyToken, createAppointment);
router.get("/", verifyToken, getUserAppointments);

export default router;
