-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'REPAID');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "friend_name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "receipt_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "loan_entries_user_id_idx" ON "loan_entries"("user_id");

-- CreateIndex
CREATE INDEX "loan_entries_due_date_status_idx" ON "loan_entries"("due_date", "status");

-- AddForeignKey
ALTER TABLE "loan_entries" ADD CONSTRAINT "loan_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

