/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `Registers` table. All the data in the column will be lost.
  - Added the required column `lastUpDateBy` to the `Registers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registers` DROP COLUMN `isAdmin`,
    ADD COLUMN `lastUpDateBy` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastUpDateDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Operators` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(50) NOT NULL,
    `fullName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `isAdmin` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Operators_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
