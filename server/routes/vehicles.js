import express from "express";
import { verifyToken } from "../utils/authMiddleware.js";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehiclesController.js";

const router = express.Router();

router.get("/", verifyToken, getVehicles);
router.post("/", verifyToken, addVehicle);
router.put("/:id", verifyToken, updateVehicle);
router.delete("/:id", verifyToken, deleteVehicle);

export default router;
