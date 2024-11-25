/*
  Warnings:

  - You are about to alter the column `store_name` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "store" ALTER COLUMN "store_name" SET DATA TYPE VARCHAR(100);
