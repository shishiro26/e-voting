/*
  Warnings:

  - You are about to drop the column `college_email` on the `colleges` table. All the data in the column will be lost.
  - Added the required column `email` to the `colleges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `colleges` DROP COLUMN `college_email`,
    ADD COLUMN `email` VARCHAR(255) NOT NULL;
