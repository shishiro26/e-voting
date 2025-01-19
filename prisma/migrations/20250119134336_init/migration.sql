/*
  Warnings:

  - A unique constraint covering the columns `[suffix_email]` on the table `colleges` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `colleges` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `first_name` VARCHAR(255) NULL,
    MODIFY `last_name` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `colleges_suffix_email_key` ON `colleges`(`suffix_email`);

-- CreateIndex
CREATE UNIQUE INDEX `colleges_email_key` ON `colleges`(`email`);
