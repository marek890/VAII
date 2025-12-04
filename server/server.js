import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
