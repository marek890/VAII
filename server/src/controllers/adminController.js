import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.user_id, 
        u.first_name || ' ' || u.last_name AS name, 
        u.email, 
        u.active,
        CASE u.role_id 
          WHEN 1 THEN 'customer' 
          WHEN 2 THEN 'mechanic' 
          WHEN 3 THEN 'admin' 
        END AS role
      FROM "User" u
      ORDER BY u.user_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa načítať používateľov" });
  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const { name, email, role, active } = req.body;

  try {
    if (name) {
      const [firstName, ...lastNameArr] = name.split(" ");
      const lastName = lastNameArr.join(" ") || "";
      await pool.query(
        `UPDATE "User" SET first_name = $1, last_name = $2 WHERE user_id = $3`,
        [firstName, lastName, userId],
      );
    }

    if (email) {
      await pool.query(`UPDATE "User" SET email = $1 WHERE user_id = $2`, [
        email,
        userId,
      ]);
    }

    if (role) {
      const roleId = role === "customer" ? 1 : role === "mechanic" ? 2 : 3;
      await pool.query(`UPDATE "User" SET role_id = $1 WHERE user_id = $2`, [
        roleId,
        userId,
      ]);
    }

    if (typeof active === "boolean") {
      await pool.query(`UPDATE "User" SET active = $1 WHERE user_id = $2`, [
        active,
        userId,
      ]);
    }

    res.json({ message: "Používateľ aktualizovaný" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať používateľa" });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.car_id, 
        v.brand, 
        v.model, 
        COALESCE(v.license_plate, '') AS license_plate,
        COALESCE(u.first_name || ' ' || u.last_name, '') AS owner_name
      FROM "Car" v
      JOIN "User" u ON v.user_id = u.user_id
      ORDER BY v.car_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa načítať vozidlá" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.appointment_id, v.brand, v.model, v.license_plate,
             u.first_name || ' ' || u.last_name AS customer_name,
             a.appointment_datetime, s.name AS status, a.notes,
             COALESCE(json_agg(sv.service_name) FILTER (WHERE sv.service_name IS NOT NULL), '[]') AS services
      FROM "Appointment" a
      JOIN "Car" v ON a.car_id = v.car_id
      JOIN "User" u ON a.customer_id = u.user_id
      JOIN "Status" s ON a.status_id = s.status_id
      LEFT JOIN "AppointmentService" aps ON a.appointment_id = aps.appointment_id
      LEFT JOIN "Service" sv ON aps.service_id = sv.service_id
      GROUP BY a.appointment_id, v.brand, v.model, v.license_plate, u.first_name, u.last_name, a.appointment_datetime, s.name, a.notes
      ORDER BY a.appointment_id
    `);

    const appointments = result.rows.map((a) => ({
      ...a,
      services: a.services.map((name) => ({ service_name: name })),
    }));

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa načítať rezervácie" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const appointmentId = parseInt(req.params.appointment_id);
  const { status } = req.body;

  const allowedStatuses = ["Vytvorená", "Začatá", "Ukončená", "Zrušená"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Neplatný status" });
  }

  try {
    const statusResult = await pool.query(
      `SELECT status_id FROM "Status" WHERE name = $1`,
      [status],
    );
    if (statusResult.rows.length === 0) {
      return res.status(400).json({ error: "Status neexistuje" });
    }

    const statusId = statusResult.rows[0].status_id;

    await pool.query(
      `UPDATE "Appointment" SET status_id = $1 WHERE appointment_id = $2`,
      [statusId, appointmentId],
    );

    res.json({ message: "Status rezervácie aktualizovaný" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Nepodarilo sa aktualizovať status rezervácie" });
  }
};

export const updateVehicle = async (req, res) => {
  const carId = parseInt(req.params.car_id);
  const { brand, model, license_plate } = req.body;

  try {
    if (brand) {
      await pool.query(`UPDATE "Car" SET brand = $1 WHERE car_id = $2`, [
        brand,
        carId,
      ]);
    }

    if (model) {
      await pool.query(`UPDATE "Car" SET model = $1 WHERE car_id = $2`, [
        model,
        carId,
      ]);
    }

    if (license_plate !== undefined) {
      await pool.query(
        `UPDATE "Car" SET license_plate = $1 WHERE car_id = $2`,
        [license_plate, carId],
      );
    }

    res.json({ message: "Vozidlo aktualizované" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať vozidlo" });
  }
};

export const deleteVehicle = async (req, res) => {
  const carId = parseInt(req.params.car_id);

  try {
    await pool.query(`DELETE FROM "Car" WHERE car_id = $1`, [carId]);
    res.json({ message: "Vozidlo vymazané" });
  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({
        error: "Vozidlo má existujúce rezervácie a nemôže byť vymazané",
      });
    }

    res.status(500).json({ error: "Nepodarilo sa vymazať vozidlo" });
  }
};
