/*
  Warnings:

  - You are about to drop the column `votes` on the `elections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `candidates` ADD COLUMN `votes` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `elections` DROP COLUMN `votes`;
