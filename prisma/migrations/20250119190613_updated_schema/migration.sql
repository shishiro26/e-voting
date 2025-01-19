/*
  Warnings:

  - You are about to alter the column `approved` on the `candidate` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `candidate` MODIFY `approved` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending';
