-- CreateEnum
CREATE TYPE "trading_kind_enum" AS ENUM ('buy', 'sell');

-- CreateTable
CREATE TABLE "pools" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" BIGSERIAL NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "decimals" SMALLINT NOT NULL,
    "unit_amount" BIGINT NOT NULL,
    "name" VARCHAR(32),
    "symbol" VARCHAR(10),
    "image" VARCHAR(10),

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trading_logs" (
    "id" BIGSERIAL NOT NULL,
    "token_id" BIGINT NOT NULL,
    "user_id" INTEGER,
    "amount" BIGINT NOT NULL,
    "kind" "trading_kind_enum" NOT NULL,

    CONSTRAINT "trading_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "username" VARCHAR(20),
    "referrer_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_prices" (
    "id" BIGSERIAL NOT NULL,
    "token_id" BIGINT NOT NULL,
    "price" DECIMAL(26,18) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'sol',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pools_address_key" ON "pools"("address");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_address_key" ON "tokens"("address");

-- CreateIndex
CREATE UNIQUE INDEX "trading_logs_token_id_user_id_key" ON "trading_logs"("token_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "trading_logs" ADD CONSTRAINT "trading_logs_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trading_logs" ADD CONSTRAINT "trading_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_prices" ADD CONSTRAINT "token_prices_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
