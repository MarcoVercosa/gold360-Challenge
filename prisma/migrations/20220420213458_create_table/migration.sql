/*
  Warnings:

  - You are about to drop the column `cancelled` on the `Registers` table. All the data in the column will be lost.
  - Added the required column `canceled` to the `Registers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registers` DROP COLUMN `cancelled`,
    ADD COLUMN `canceled` BOOLEAN NOT NULL;
