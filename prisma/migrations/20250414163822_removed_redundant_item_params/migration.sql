/*
  Warnings:

  - You are about to drop the column `description` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `Invoice` table. All the data in the column will be lost.
  - Made the column `dueDate` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "description",
DROP COLUMN "quantity",
DROP COLUMN "rate",
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "dueDate" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tax" SET DEFAULT 0,
ALTER COLUMN "tax" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DEFAULT 0,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
