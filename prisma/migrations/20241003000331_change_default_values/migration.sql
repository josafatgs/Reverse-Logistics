-- AlterTable
ALTER TABLE `Devolution` MODIFY `mainReason` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `sucursal` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `explanation` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `ticketNumber` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `clientNumber` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `orderNumber` VARCHAR(191) NOT NULL DEFAULT '';
