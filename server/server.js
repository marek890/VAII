import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import vehiclesRoutes from "./routes/vehicles.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRouter);
app.use("/api/vehicles", vehiclesRoutes);

app.listen(5001, () => console.log("Server running on port 5001"));
