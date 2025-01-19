/*
  Warnings:

  - Made the column `college_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_college_id_fkey`;

-- DropIndex
DROP INDEX `users_college_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `college_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_college_id_fkey` FOREIGN KEY (`college_id`) REFERENCES `colleges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
