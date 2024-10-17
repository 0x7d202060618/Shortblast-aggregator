-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "decimals" SET DEFAULT 9,
ALTER COLUMN "unit_amount" SET DEFAULT 1000000000;

-- AlterTable
ALTER TABLE "trading_logs" ADD COLUMN     "sol_amount" BIGINT NOT NULL DEFAULT 0;
