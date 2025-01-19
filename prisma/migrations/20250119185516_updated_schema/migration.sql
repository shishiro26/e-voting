/*
  Warnings:

  - Added the required column `tagline` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidate` ADD COLUMN `image` VARCHAR(255) NULL,
    ADD COLUMN `tagline` VARCHAR(255) NOT NULL;
