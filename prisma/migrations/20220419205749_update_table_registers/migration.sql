/*
  Warnings:

  - You are about to drop the column `name` on the `Registers` table. All the data in the column will be lost.
  - You are about to alter the column `fullName` on the `Registers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `email` on the `Registers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `password` on the `Registers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `firstName` to the `Registers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Registers` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(50) NOT NULL,
    MODIFY `fullName` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(100) NOT NULL;
