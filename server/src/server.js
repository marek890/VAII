import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import vehiclesRoutes from "./routes/vehicles.js";
import profileRouter from "./routes/profile.js";
import appointmentsRouter from "./routes/appointments.js";
import adminRouter from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRouter);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/appointment", appointmentsRouter);
app.use("/api/admin", adminRouter);

app.listen(5001, () => console.log("Server running on port 5001"));
