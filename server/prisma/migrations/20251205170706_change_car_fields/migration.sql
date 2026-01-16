/*
  Warnings:

  - Made the column `fuel_type` on table `Car` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Car" ALTER COLUMN "license_plate" DROP NOT NULL,
ALTER COLUMN "fuel_type" SET NOT NULL;
