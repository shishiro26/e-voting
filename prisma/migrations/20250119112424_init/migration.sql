-- CreateTable
CREATE TABLE `colleges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `suffix_email` VARCHAR(255) NOT NULL,
    `college_email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `colleges_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('super_admin', 'admin', 'voter') NOT NULL DEFAULT 'voter',
    `password` VARCHAR(255) NOT NULL,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `email_verify_token` VARCHAR(255) NULL,
    `password_reset_token` VARCHAR(255) NULL,
    `token_send_at` DATETIME(3) NULL,
    `college_id` INTEGER NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refresh_token` VARCHAR(1024) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_college_id_fkey` FOREIGN KEY (`college_id`) REFERENCES `colleges`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
