-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "UserInfo" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileURL" TEXT NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validatorEmail" TEXT NOT NULL,
    "claimId" INTEGER NOT NULL,
    "validationStatus" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "response" BOOLEAN DEFAULT false,
    "validationDate" TIMESTAMP(3),
    "statement" TEXT,

    CONSTRAINT "ValidationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_claimId_key" ON "UserInfo"("claimId");
