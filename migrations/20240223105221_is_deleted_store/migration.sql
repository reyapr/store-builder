/*
  Warnings:

  - A unique constraint covering the columns `[name,isDeleted]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Store_name_key";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Store_name_isDeleted_key" ON "Store"("name", "isDeleted");
