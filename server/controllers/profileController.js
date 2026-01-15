import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const phoneRegex = /^(\+421|0)\d{9}$/;

export const getData = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, first_name, last_name, phone, email FROM "User" WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Užívateľ nenájdený" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba servera" });
  }
};

export const updateData = async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  if (!firstName || firstName.length < 2) {
    return res.status(400).json({ error: "Neplatné meno" });
  }

  if (!lastName || lastName.length < 2) {
    return res.status(400).json({ error: "Neplatné priezvisko" });
  }

  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Neplatné telefónne číslo" });
  }

  try {
    await pool.query(
      'UPDATE "User" SET first_name = $1, last_name = $2, phone = $3 WHERE user_id = $4',
      [firstName, lastName, phone, req.user.id]
    );

    res.json({ message: "Profil bol aktualizovaný" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri ukladaní profilu" });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Chýbajú údaje" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ error: "Nové heslo musí mať aspoň 8 znakov" });
  }

  try {
    const result = await pool.query(
      'SELECT password FROM "User" WHERE user_id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Nesprávne aktuálne heslo" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(`UPDATE "User" SET password = $1 WHERE user_id = $2`, [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Heslo bolo úspešne zmenené" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Zmena hesla zlyhala" });
  }
};
