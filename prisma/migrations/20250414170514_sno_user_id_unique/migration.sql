/*
  Warnings:

  - A unique constraint covering the columns `[sno,userId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invoice_sno_userId_key" ON "Invoice"("sno", "userId");
