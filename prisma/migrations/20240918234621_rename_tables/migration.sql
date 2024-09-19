/*
  Warnings:

  - You are about to drop the `DEVOLUTION` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DEVOLUTION_IMAGE` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DEVOLUTION_ITEM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RESOLUTION` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RESOLUTION_IMAGE` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SESSION` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DEVOLUTION_IMAGE` DROP FOREIGN KEY `DEVOLUTION_IMAGE_devolutionId_fkey`;

-- DropForeignKey
ALTER TABLE `DEVOLUTION_ITEM` DROP FOREIGN KEY `DEVOLUTION_ITEM_devolutionId_fkey`;

-- DropForeignKey
ALTER TABLE `RESOLUTION` DROP FOREIGN KEY `RESOLUTION_devolutionId_fkey`;

-- DropForeignKey
ALTER TABLE `RESOLUTION_IMAGE` DROP FOREIGN KEY `RESOLUTION_IMAGE_resolutionId_fkey`;

-- DropTable
DROP TABLE `DEVOLUTION`;

-- DropTable
DROP TABLE `DEVOLUTION_IMAGE`;

-- DropTable
DROP TABLE `DEVOLUTION_ITEM`;

-- DropTable
DROP TABLE `RESOLUTION`;

-- DropTable
DROP TABLE `RESOLUTION_IMAGE`;

-- DropTable
DROP TABLE `SESSION`;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isOnline` BOOLEAN NOT NULL DEFAULT false,
    `scope` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `userId` BIGINT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `accountOwner` BOOLEAN NOT NULL DEFAULT false,
    `locale` VARCHAR(191) NULL,
    `collaborator` BOOLEAN NULL DEFAULT false,
    `emailVerified` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Devolution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `mainReason` VARCHAR(191) NOT NULL,
    `sucursal` VARCHAR(191) NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `ticketNumber` INTEGER NOT NULL,
    `clientNumber` INTEGER NOT NULL,
    `orderNumber` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnmentLabel` VARCHAR(191) NOT NULL,
    `dateProductArrive` DATETIME(3) NOT NULL,
    `shippingPayment` BOOLEAN NOT NULL DEFAULT false,
    `requiresLabel` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Devolution_Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devolutionId` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Devolution_Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devolutionId` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resolution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comentarios` VARCHAR(191) NOT NULL,
    `ndc` VARCHAR(191) NOT NULL,
    `devolutionId` INTEGER NOT NULL,

    UNIQUE INDEX `Resolution_devolutionId_key`(`devolutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resolution_Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resolutionId` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Devolution_Item` ADD CONSTRAINT `Devolution_Item_devolutionId_fkey` FOREIGN KEY (`devolutionId`) REFERENCES `Devolution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Devolution_Image` ADD CONSTRAINT `Devolution_Image_devolutionId_fkey` FOREIGN KEY (`devolutionId`) REFERENCES `Devolution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resolution` ADD CONSTRAINT `Resolution_devolutionId_fkey` FOREIGN KEY (`devolutionId`) REFERENCES `Devolution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resolution_Image` ADD CONSTRAINT `Resolution_Image_resolutionId_fkey` FOREIGN KEY (`resolutionId`) REFERENCES `Resolution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
