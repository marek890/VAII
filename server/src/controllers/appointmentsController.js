import { pool } from "../db.js";

const ALL_TIMES = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const getAvailableTimes = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Chýba dátum" });

  try {
    const result = await pool.query(
      `SELECT appointment_datetime, SUM(s.estimated_duration) AS total_duration
       FROM "Appointment" a
       JOIN "AppointmentService" aps ON a.appointment_id = aps.appointment_id
       JOIN "Service" s ON aps.service_id = s.service_id
       WHERE DATE(appointment_datetime) = $1
         AND a.status_id IN (1,2,3)
       GROUP BY appointment_datetime`,
      [date]
    );

    const blockedTimes = [];
    for (const row of result.rows) {
      const appointmentTime = row.appointment_datetime
        .toISOString()
        .substr(11, 5);
      const startMinutes = timeToMinutes(appointmentTime);
      const duration = Number(row.total_duration);
      const slotsNeeded = Math.ceil(duration / 30);
      for (let i = 0; i < slotsNeeded; i++) {
        blockedTimes.push(minutesToTime(startMinutes + i * 30));
      }
    }

    const availableTimes = ALL_TIMES.filter((t) => !blockedTimes.includes(t));
    res.json(availableTimes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Chyba servera pri získavaní voľných časov" });
  }
};

export const createAppointment = async (req, res) => {
  const { car_id, services, appointment_date, appointment_time, notes } =
    req.body;

  if (
    !car_id ||
    !services ||
    services.length === 0 ||
    !appointment_date ||
    !appointment_time
  ) {
    return res.status(400).json({ error: "Chýbajú údaje" });
  }

  try {
    const mechRes = await pool.query(
      `SELECT user_id FROM "User" WHERE role_id = 2 LIMIT 1`
    );
    if (mechRes.rows.length === 0)
      return res.status(400).json({ error: "Žiadny mechanik nie je dostupný" });

    const mechanic_id = mechRes.rows[0].user_id;

    const serviceRes = await pool.query(
      `SELECT SUM(estimated_duration) AS total_duration
       FROM "Service"
       WHERE service_id = ANY($1::int[])`,
      [services]
    );

    const totalDuration = Number(serviceRes.rows[0].total_duration);

    const requestedStart = timeToMinutes(appointment_time);

    const result = await pool.query(
      `SELECT appointment_datetime, SUM(s.estimated_duration) AS total_duration
       FROM "Appointment" a
       JOIN "AppointmentService" aps ON a.appointment_id = aps.appointment_id
       JOIN "Service" s ON aps.service_id = s.service_id
       WHERE a.mechanic_id = $1
         AND DATE(a.appointment_datetime) = $2
         AND a.status_id IN (1,2,3)
       GROUP BY appointment_datetime`,
      [mechanic_id, appointment_date]
    );

    const blockedTimes = [];
    for (const row of result.rows) {
      const appointmentTime = row.appointment_datetime
        .toISOString()
        .substr(11, 5);
      const startMinutes = timeToMinutes(appointmentTime);
      const duration = Number(row.total_duration);
      const slotsNeeded = Math.ceil(duration / 30);
      for (let i = 0; i < slotsNeeded; i++) {
        blockedTimes.push(minutesToTime(startMinutes + i * 30));
      }
    }

    const requestedSlots = Math.ceil(totalDuration / 30);
    for (let i = 0; i < requestedSlots; i++) {
      const slotTime = minutesToTime(requestedStart + i * 30);
      if (blockedTimes.includes(slotTime)) {
        return res
          .status(400)
          .json({ error: "Vybrané časové okno nie je dostupné" });
      }
    }

    const appointment_datetime = new Date(
      `${appointment_date}T${appointment_time}:00`
    );

    const insertAppointment = await pool.query(
      `INSERT INTO "Appointment" 
       (customer_id, car_id, mechanic_id, status_id, appointment_datetime, notes, created_at)
       VALUES ($1,$2,$3,1,$4,$5,NOW())
       RETURNING appointment_id`,
      [req.user.id, car_id, mechanic_id, appointment_datetime, notes || ""]
    );

    const appointment_id = insertAppointment.rows[0].appointment_id;

    const servicePromises = services.map((service_id) =>
      pool.query(
        `INSERT INTO "AppointmentService" (appointment_id, service_id) VALUES ($1, $2)`,
        [appointment_id, service_id]
      )
    );
    await Promise.all(servicePromises);

    res.status(201).json({ message: "Objednávka bola úspešne vytvorená" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri vytváraní objednávky" });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.appointment_id, a.appointment_datetime, a.notes,
              s.name AS status, c.brand, c.model, c.license_plate
       FROM "Appointment" a
       JOIN "Status" s ON a.status_id = s.status_id
       JOIN "Car" c ON a.car_id = c.car_id
       WHERE a.customer_id = $1
       ORDER BY a.appointment_datetime`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri načítaní objednávok" });
  }
};

export const getServices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT service_id, service_name, description, estimated_duration
       FROM "Service"
       ORDER BY service_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri načítaní služieb" });
  }
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT status_id
       FROM "Appointment"
       WHERE appointment_id = $1 AND customer_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Objednávka neexistuje" });
    }

    const status_id = result.rows[0].status_id;

    if (status_id === 3) {
      return res
        .status(400)
        .json({ error: "Ukončenú objednávku nie je možné zrušiť" });
    }

    await pool.query(
      `UPDATE "Appointment"
       SET status_id = 4
       WHERE appointment_id = $1`,
      [id]
    );

    res.json({ message: "Objednávka bola zrušená" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri rušení objednávky" });
  }
};
