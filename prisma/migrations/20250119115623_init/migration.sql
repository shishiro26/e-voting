-- AlterTable
ALTER TABLE `colleges` ADD COLUMN `email_verify_token` VARCHAR(255) NULL,
    ADD COLUMN `is_verified` BOOLEAN NOT NULL DEFAULT false;
