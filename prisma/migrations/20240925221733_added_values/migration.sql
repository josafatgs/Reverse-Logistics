-- AlterTable
ALTER TABLE `Devolution` ADD COLUMN `contacto` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `monedero` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `value` DOUBLE NOT NULL DEFAULT 0;
