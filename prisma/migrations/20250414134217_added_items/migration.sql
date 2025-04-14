/*
  Warnings:

  - A unique constraint covering the columns `[sno,userId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_sno_userId_key" ON "Invoice"("sno", "userId");

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
