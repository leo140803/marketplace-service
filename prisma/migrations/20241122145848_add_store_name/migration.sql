/*
  Warnings:

  - Added the required column `store_name` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store" ADD COLUMN     "store_name" TEXT NOT NULL;
