import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import {
  getAvailableTimes,
  createAppointment,
  getUserAppointments,
  getServices,
  cancelAppointment,
} from "../controllers/appointmentsController.js";

const router = express.Router();

router.get("/available-times", verifyToken, getAvailableTimes);
router.get("/services", verifyToken, getServices);
router.post("/", verifyToken, createAppointment);
router.get("/", verifyToken, getUserAppointments);
router.delete("/:id", verifyToken, cancelAppointment);

export default router;
