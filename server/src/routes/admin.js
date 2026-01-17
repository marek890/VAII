import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import {
  getUsers,
  updateUser,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  getAppointments,
  updateAppointmentStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.put("/users/:user_id", verifyToken, updateUser);
router.get("/vehicles", verifyToken, getVehicles);
router.put("/vehicles/:car_id", verifyToken, updateVehicle);
router.delete("/vehicles/:car_id", verifyToken, deleteVehicle);
router.get("/appointments", verifyToken, getAppointments);
router.put(
  "/appointments/:appointment_id/status",
  verifyToken,
  updateAppointmentStatus
);

export default router;
