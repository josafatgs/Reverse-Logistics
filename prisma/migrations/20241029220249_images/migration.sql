-- AlterTable
ALTER TABLE `Devolution` MODIFY `dateProductArrive` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `DevolutionImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devolutionId` INTEGER NOT NULL,
    `image` LONGBLOB NOT NULL,
    `imageName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DevolutionImage` ADD CONSTRAINT `DevolutionImage_devolutionId_fkey` FOREIGN KEY (`devolutionId`) REFERENCES `Devolution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
