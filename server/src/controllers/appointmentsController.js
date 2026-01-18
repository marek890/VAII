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
      [date],
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

  if (notes && notes.length > 200) {
    return res
      .status(400)
      .json({ error: "Poznámky môžu mať maximálne 200 znakov" });
  }

  const today = new Date();
  const selectedDate = new Date(`${appointment_date}T00:00`);
  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ error: "Neplatný dátum" });
  }
  if (selectedDate < new Date(today.toDateString())) {
    return res.status(400).json({ error: "Nemôžete vybrať minulý dátum" });
  }

  if (!ALL_TIMES.includes(appointment_time)) {
    return res.status(400).json({ error: "Neplatný čas" });
  }

  if (appointment_date === today.toISOString().slice(0, 10)) {
    const [hours, minutes] = appointment_time.split(":").map(Number);
    const selectedDateTime = new Date(today);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    if (selectedDateTime < today) {
      return res.status(400).json({ error: "Nemôžete vybrať čas v minulosti" });
    }
  }

  try {
    const carRes = await pool.query(
      `SELECT car_id FROM "Car" WHERE car_id = $1 AND user_id = $2`,
      [car_id, req.user.id],
    );
    if (carRes.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Vybrané auto neexistuje alebo mu nepatrí" });
    }

    const serviceRes = await pool.query(
      `SELECT service_id FROM "Service" WHERE service_id = ANY($1::int[])`,
      [services],
    );
    if (serviceRes.rows.length !== services.length) {
      return res
        .status(400)
        .json({ error: "Niektoré vybrané služby neexistujú" });
    }

    const mechRes = await pool.query(
      `SELECT user_id FROM "User" WHERE role_id = 2 LIMIT 1`,
    );
    if (mechRes.rows.length === 0) {
      return res.status(400).json({ error: "Žiadny mechanik nie je dostupný" });
    }
    const mechanic_id = mechRes.rows[0].user_id;

    const totalDurationRes = await pool.query(
      `SELECT SUM(estimated_duration) AS total_duration FROM "Service" WHERE service_id = ANY($1::int[])`,
      [services],
    );
    const totalDuration = Number(totalDurationRes.rows[0].total_duration);
    const requestedStart = timeToMinutes(appointment_time);
    const requestedSlots = Math.ceil(totalDuration / 30);

    const existingAppointments = await pool.query(
      `SELECT appointment_datetime, SUM(s.estimated_duration) AS total_duration
       FROM "Appointment" a
       JOIN "AppointmentService" aps ON a.appointment_id = aps.appointment_id
       JOIN "Service" s ON aps.service_id = s.service_id
       WHERE a.mechanic_id = $1
         AND DATE(a.appointment_datetime) = $2
         AND a.status_id IN (1,2,3)
       GROUP BY appointment_datetime`,
      [mechanic_id, appointment_date],
    );

    const blockedTimes = [];
    for (const row of existingAppointments.rows) {
      const appointmentTimeStr = row.appointment_datetime
        .toISOString()
        .substr(11, 5);
      const startMinutes = timeToMinutes(appointmentTimeStr);
      const duration = Number(row.total_duration);
      const slotsNeeded = Math.ceil(duration / 30);
      for (let i = 0; i < slotsNeeded; i++) {
        blockedTimes.push(minutesToTime(startMinutes + i * 30));
      }
    }

    for (let i = 0; i < requestedSlots; i++) {
      const slotTime = minutesToTime(requestedStart + i * 30);
      if (blockedTimes.includes(slotTime)) {
        return res
          .status(400)
          .json({ error: "Vybrané časové okno nie je dostupné" });
      }
    }

    const appointment_datetime = new Date(
      `${appointment_date}T${appointment_time}:00`,
    );

    const insertAppointment = await pool.query(
      `INSERT INTO "Appointment" 
       (customer_id, car_id, mechanic_id, status_id, appointment_datetime, notes, created_at)
       VALUES ($1,$2,$3,1,$4,$5,NOW())
       RETURNING appointment_id`,
      [req.user.id, car_id, mechanic_id, appointment_datetime, notes || ""],
    );

    const appointment_id = insertAppointment.rows[0].appointment_id;

    const servicePromises = services.map((service_id) =>
      pool.query(
        `INSERT INTO "AppointmentService" (appointment_id, service_id) VALUES ($1, $2)`,
        [appointment_id, service_id],
      ),
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
              s.name AS status,
              c.brand, c.model, c.license_plate,
              json_agg(
                json_build_object(
                  'service_id', srv.service_id,
                  'service_name', srv.service_name,
                  'estimated_duration', srv.estimated_duration
                )
              ) AS services
       FROM "Appointment" a
       JOIN "Status" s ON a.status_id = s.status_id
       JOIN "Car" c ON a.car_id = c.car_id
       LEFT JOIN "AppointmentService" aps ON a.appointment_id = aps.appointment_id
       LEFT JOIN "Service" srv ON aps.service_id = srv.service_id
       WHERE a.customer_id = $1
       GROUP BY a.appointment_id, s.name, c.brand, c.model, c.license_plate
       ORDER BY a.appointment_datetime`,
      [req.user.id],
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
       ORDER BY service_name`,
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
    let query;
    let params;

    if (req.user.role === "Customer") {
      query = `
        SELECT status_id
        FROM "Appointment"
        WHERE appointment_id = $1 AND customer_id = $2
      `;
      params = [id, req.user.id];
    } else if (req.user.role === "Mechanic" || req.user.role === "Admin") {
      query = `
        SELECT status_id
        FROM "Appointment"
        WHERE appointment_id = $1
      `;
      params = [id];
    } else {
      return res.status(403).json({ error: "Nemáte oprávnenie" });
    }

    const result = await pool.query(query, params);

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
      [id],
    );

    res.json({ message: "Objednávka bola zrušená" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri rušení objednávky" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: "Chýba nový status" });

  try {
    const statusRes = await pool.query(
      `SELECT status_id FROM "Status" WHERE name = $1`,
      [status],
    );

    if (statusRes.rows.length === 0)
      return res.status(400).json({ error: "Neplatný status" });

    const status_id = statusRes.rows[0].status_id;

    const result = await pool.query(
      `UPDATE "Appointment"
       SET status_id = $1
       WHERE appointment_id = $2`,
      [status_id, id],
    );

    res.json({ message: `Status objednávky bol zmenený na '${status}'` });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Chyba pri aktualizácii statusu objednávky" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        a.appointment_id,
        a.appointment_datetime,
        a.notes,

        s.name AS status,

        COALESCE(c.brand, '—') AS brand,
        COALESCE(c.model, '—') AS model,
        COALESCE(c.license_plate, '—') AS license_plate,

        COALESCE(u.first_name, 'Neznámy') AS first_name,
        COALESCE(u.last_name, 'užívateľ') AS last_name,

        COALESCE(
          json_agg(
            json_build_object(
              'service_id', srv.service_id,
              'service_name', srv.service_name,
              'estimated_duration', srv.estimated_duration
            )
          ) FILTER (WHERE srv.service_id IS NOT NULL),
          '[]'
        ) AS services

      FROM "Appointment" a
      JOIN "Status" s ON a.status_id = s.status_id

      LEFT JOIN "Car" c ON a.car_id = c.car_id
      LEFT JOIN "User" u ON a.customer_id = u.user_id
      LEFT JOIN "AppointmentService" aps ON a.appointment_id = aps.appointment_id
      LEFT JOIN "Service" srv ON aps.service_id = srv.service_id

      GROUP BY
        a.appointment_id,
        s.name,
        c.brand, c.model, c.license_plate,
        u.first_name, u.last_name

      ORDER BY a.appointment_datetime;
      `,
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri načítaní objednávok" });
  }
};
