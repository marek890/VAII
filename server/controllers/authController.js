import bcrypt from "bcryptjs";
import { pool } from "../db.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@") || !password || password.length < 8) {
    return res.status(400).json({ error: "Neplatný email alebo heslo" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO "User" (email, password, role_id) VALUES ($1, $2, $3)',
      [email, hashed, 1]
    );

    return res.status(201).json({ message: "Registrácia úspešná" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email už bol použitý" });
    }
    return res.status(500).json({ error: "Registrácia zlyhala" });
  }
};
