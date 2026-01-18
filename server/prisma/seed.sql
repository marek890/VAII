CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO "Role" ("role_name") VALUES
('Customer'),
('Mechanic'),
('Admin')
ON CONFLICT ("role_name") DO NOTHING;

INSERT INTO "Status" ("name") VALUES
('Vytvorená'),
('Začatá'),
('Ukončená'),
('Zrušená')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "User"
("first_name", "last_name", "email", "password", "phone", "role_id", "active")
VALUES
('Peter', 'Novák', 'peter@gmail.com', crypt('admin123', gen_salt('bf')), '0912345678', 3, TRUE),
('Ján', 'Kováč', 'jan@gmail.com', crypt('mechanic', gen_salt('bf')), '0901234567', 2, TRUE),
('Marek', 'Horváth', 'marek@gmail.com', crypt('mechanic', gen_salt('bf')), '0909876543', 2, TRUE),
('Eva', 'Horváthová', 'eva@gmail.com', crypt('customer', gen_salt('bf')), '0908765432', 1, TRUE),
('Tomáš', 'Biely', 'tomas@gmail.com', crypt('customer', gen_salt('bf')), '0911111111', 1, TRUE),
('Lucia', 'Zelená', 'lucia@gmail.com', crypt('customer', gen_salt('bf')), '0922222222', 1, TRUE)
ON CONFLICT ("email") DO NOTHING;


INSERT INTO "Car" ("brand", "model", "license_plate", "year", "vin", "fuel_type", "mileage", "color", "user_id") VALUES
('Toyota', 'Corolla', 'BA123CD', 2018, 'JTDBU4EE9A9123456', 'Benzín', 45000, 'Biela', 4),
('BMW', '320d', 'BB456EF', 2020, 'WBAVM71020K123456', 'Diesel', 30000, 'Čierna', 4),
('Audi', 'A4', 'BC789GH', 2019, 'WAUZZZ8K9DA123456', 'Benzín', 40000, 'Modrá', 5),
('Honda', 'Civic', 'BD111IJ', 2017, '2HGFG3B52HH123456', 'Benzín', 55000, 'Šedá', 5),
('Ford', 'Focus', 'BE222KL', 2021, 'WF0XXXTTGXXX12345', 'Diesel', 25000, 'Červená', 6),
('Škoda', 'Octavia', 'BF333MN', 2016, 'TMBJG9NE1G1234567', 'Benzín', 80000, 'Biela', 6)
ON CONFLICT ("car_id") DO NOTHING;

INSERT INTO "Service" ("service_name", "description", "estimated_duration") VALUES
('Výmena oleja', 'Kompletná výmena motorového oleja a filtra', 30),
('Kontrola bŕzd', 'Kontrola brzdových doštičiek a kotúčov, doplnenie brzdovej kvapaliny', 45),
('Diagnostika motora', 'Kontrola a diagnostika motorového systému', 60),
('Výmena filtrov', 'Výmena vzduchového a kabínového filtra', 20),
('Geometria kolies', 'Nastavenie geometrie kolies', 50),
('Výmena sviečok', 'Výmena zapaľovacích sviečok', 25),
('Výmena oleja v prevodovke', 'Kompletná výmena prevodového oleja', 40),
('Kontrola klimatizácie', 'Kontrola a doplnenie chladiva klimatizácie', 30),
('Výmena batérie', 'Výmena autobatérie a kontrola nabíjania', 20),
('Výměna tlmičov', 'Kontrola a výmena predných alebo zadných tlmičov', 60)
ON CONFLICT ("service_id") DO NOTHING;

INSERT INTO "Appointment" ("customer_id", "mechanic_id", "car_id", "status_id", "appointment_datetime", "notes", "created_at") VALUES
(4, 2, 1, 1, '2026-01-18 10:00:00', 'Potrebná výmena oleja', NOW()),
(5, 3, 3, 2, '2026-01-19 14:00:00', 'Skontrolovať brzdy', NOW()),
(6, 2, 5, 1, '2026-01-20 09:00:00', 'Geometria kolies', NOW()),
(4, 3, 2, 1, '2026-01-21 11:00:00', 'Diagnostika motora', NOW()),
(5, 2, 4, 3, '2026-01-22 15:00:00', 'Výmena filtrov', NOW())
ON CONFLICT ("appointment_id") DO NOTHING;

INSERT INTO "AppointmentService" ("appointment_id", "service_id") VALUES
(1, 1),
(2, 2),
(3, 5),
(4, 3),
(4, 4),
(5, 4)
ON CONFLICT ("appointment_id", "service_id") DO NOTHING;