import express from "express";
import { verifyToken, requireRole } from "../utils/authMiddleware.js";
import {
  getAvailableTimes,
  createAppointment,
  getUserAppointments,
  getServices,
  cancelAppointment,
  updateAppointmentStatus,
  getAllAppointments,
} from "../controllers/appointmentsController.js";

const router = express.Router();

router.get("/available-times", verifyToken, getAvailableTimes);
router.get("/services", verifyToken, getServices);
router.post("/", verifyToken, createAppointment);
router.get("/", verifyToken, getUserAppointments);
router.delete(
  "/:id",
  verifyToken,
  requireRole(["Customer", "Mechanic", "Admin"]),
  cancelAppointment,
);
router.put(
  "/:id/status",
  verifyToken,
  requireRole(["Admin", "Mechanic"]),
  updateAppointmentStatus,
);
router.get(
  "/all",
  verifyToken,
  requireRole(["Admin", "Mechanic"]),
  getAllAppointments,
);

export default router;
