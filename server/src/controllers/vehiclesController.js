import { pool } from "../db.js";
import { validateVehicleData } from "../utils/validators.js";

export const getVehicles = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "Car" WHERE "user_id" = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chyba servera" });
  }
};

export const addVehicle = async (req, res) => {
  const errors = validateVehicleData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  const { brand, model, license_plate, year, vin, fuel_type, mileage, color } =
    req.body;

  try {
    const result = await pool.query(
      `INSERT INTO "Car" 
      ("brand", "model", "license_plate", "year", "vin", "fuel_type", "mileage", "color", "user_id") 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        brand,
        model,
        license_plate || null,
        year || null,
        vin || null,
        fuel_type,
        mileage || null,
        color || null,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chyba servera" });
  }
};

export const updateVehicle = async (req, res) => {
  const errors = validateVehicleData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  const { id } = req.params;
  const { brand, model, license_plate, year, vin, fuel_type, mileage, color } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE "Car" SET 
        "brand"=$1, 
        "model"=$2, 
        "license_plate"=$3, 
        "year"=$4, 
        "vin"=$5, 
        "fuel_type"=$6, 
        "mileage"=$7, 
        "color"=$8
      WHERE "car_id"=$9 AND "user_id"=$10 RETURNING *`,
      [
        brand,
        model,
        license_plate || null,
        year || null,
        vin || null,
        fuel_type,
        mileage || null,
        color || null,
        id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Vozidlo sa nenašlo" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chyba servera" });
  }
};

export const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM "Car" WHERE "car_id"=$1 AND "user_id"=$2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Vozidlo sa nenašlo" });

    res.json({ message: "Vozidlo bolo odstránené" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chyba servera" });
  }
};
