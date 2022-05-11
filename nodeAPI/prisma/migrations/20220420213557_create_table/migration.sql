/*
  Warnings:

  - Added the required column `isAdmin` to the `Registers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registers` ADD COLUMN `isAdmin` BOOLEAN NOT NULL;
