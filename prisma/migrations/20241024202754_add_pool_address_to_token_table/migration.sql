/*
  Warnings:

  - A unique constraint covering the columns `[pool_address]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pool_address` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "pool_address" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tokens_pool_address_key" ON "tokens"("pool_address");
