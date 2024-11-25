/*
  Warnings:

  - You are about to alter the column `longitude` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,20)`.
  - You are about to alter the column `latitude` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,20)`.

*/
-- AlterTable
ALTER TABLE "store" ADD COLUMN     "image_url" VARCHAR(255),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(65,20),
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(65,20);
