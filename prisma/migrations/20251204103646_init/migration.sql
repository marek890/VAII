-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Status" (
    "status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "Car" (
    "car_id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("car_id")
);

-- CreateTable
CREATE TABLE "Service" (
    "service_id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT,
    "estimated_duration" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "appointment_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "mechanic_id" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "appointment_time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "AppointmentService" (
    "appointment_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("appointment_id","service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("car_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("appointment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;
