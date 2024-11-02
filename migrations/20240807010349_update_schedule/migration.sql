/*
  Warnings:

  - You are about to drop the column `productId` on the `Schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_productId_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "ProductSchedule" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "ProductSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSchedule_productId_scheduleId_key" ON "ProductSchedule"("productId", "scheduleId");

-- AddForeignKey
ALTER TABLE "ProductSchedule" ADD CONSTRAINT "ProductSchedule_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSchedule" ADD CONSTRAINT "ProductSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
