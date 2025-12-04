import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "1h";

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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@") || !password || password.length < 8) {
    return res.status(400).json({ error: "Neplatný email alebo heslo" });
  }

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Užívateľ neexistuje" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Nesprávne heslo" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(200).json({
      message: "Prihlásenie úspešné",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
