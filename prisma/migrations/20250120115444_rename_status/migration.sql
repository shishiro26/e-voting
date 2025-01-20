/*
  Warnings:

  - You are about to drop the column `approved` on the `candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `candidate` DROP COLUMN `approved`,
    ADD COLUMN `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending';
