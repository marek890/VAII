import express from "express";
import { verifyToken, requireRole } from "../utils/authMiddleware.js";
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

router.get("/users", verifyToken, requireRole(["Admin"]), getUsers);
router.put("/users/:user_id", verifyToken, requireRole(["Admin"]), updateUser);
router.get("/vehicles", verifyToken, requireRole(["Admin"]), getVehicles);
router.put(
  "/vehicles/:car_id",
  verifyToken,
  requireRole(["Admin"]),
  updateVehicle,
);
router.delete(
  "/vehicles/:car_id",
  verifyToken,
  requireRole(["Admin"]),
  deleteVehicle,
);
router.get(
  "/appointments",
  verifyToken,
  requireRole(["Admin"]),
  getAppointments,
);
router.put(
  "/appointments/:appointment_id/status",
  verifyToken,
  requireRole(["Admin"]),
  updateAppointmentStatus,
);

export default router;
