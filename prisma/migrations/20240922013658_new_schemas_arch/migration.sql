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
    `status` VARCHAR(191) NOT NULL DEFAULT 'Pendiente',
    `mainReason` VARCHAR(191) NOT NULL,
    `sucursal` VARCHAR(191) NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `ticketNumber` INTEGER NOT NULL,
    `clientNumber` INTEGER NOT NULL,
    `orderNumber` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnmentLabel` VARCHAR(191) NOT NULL DEFAULT '',
    `dateProductArrive` DATETIME(3) NOT NULL,
    `shippingPayment` BOOLEAN NOT NULL DEFAULT false,
    `requiresLabel` BOOLEAN NOT NULL DEFAULT false,
    `comentarios` VARCHAR(191) NOT NULL DEFAULT '',
    `ndc` VARCHAR(191) NOT NULL DEFAULT '',

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

-- AddForeignKey
ALTER TABLE `Devolution_Item` ADD CONSTRAINT `Devolution_Item_devolutionId_fkey` FOREIGN KEY (`devolutionId`) REFERENCES `Devolution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
