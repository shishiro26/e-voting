-- AlterTable
ALTER TABLE `elections` ADD COLUMN `max_candidate` INTEGER NOT NULL DEFAULT 2,
    ADD COLUMN `min_candidate` INTEGER NOT NULL DEFAULT 2;
