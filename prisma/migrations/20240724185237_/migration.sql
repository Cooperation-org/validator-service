-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('PASSWORD', 'GITHUB');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PERSON', 'ORGANIZATION', 'CLAIM', 'IMPACT', 'EVENT', 'DOCUMENT', 'PRODUCT', 'PLACE', 'UNKNOWN', 'OTHER');

-- CreateEnum
CREATE TYPE "HowKnown" AS ENUM ('FIRST_HAND', 'SECOND_HAND', 'WEB_DOCUMENT', 'VERIFIED_LOGIN', 'BLOCKCHAIN', 'SIGNED_DOCUMENT', 'PHYSICAL_DOCUMENT', 'INTEGRATION', 'RESEARCH', 'OPINION', 'OTHER');

-- CreateEnum
CREATE TYPE "IssuerIdType" AS ENUM ('DID', 'ETH', 'PUBKEY', 'URL');

-- CreateTable
CREATE TABLE "ValidationRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "context" TEXT NOT NULL,
    "validatorName" TEXT NOT NULL,
    "validatorEmail" TEXT NOT NULL,
    "claimId" INTEGER NOT NULL,
    "validationStatus" "ValidationStatus" NOT NULL DEFAULT 'PENDING',
    "response" BOOLEAN DEFAULT false,
    "validationDate" TIMESTAMP(3),
    "statement" TEXT,

    CONSTRAINT "ValidationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidUserInfo" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileURL" TEXT NOT NULL,

    CONSTRAINT "CandidUserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "object" TEXT,
    "statement" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "sourceURI" TEXT,
    "howKnown" "HowKnown",
    "dateObserved" TIMESTAMP(3),
    "digestMultibase" TEXT,
    "author" TEXT,
    "curator" TEXT,
    "aspect" TEXT,
    "score" DOUBLE PRECISION,
    "stars" INTEGER,
    "amt" DOUBLE PRECISION,
    "unit" TEXT,
    "howMeasured" TEXT,
    "intendedAudience" TEXT,
    "respondAt" TEXT,
    "confidence" DOUBLE PRECISION,
    "issuerId" TEXT,
    "issuerIdType" "IssuerIdType",
    "claimAddress" TEXT,
    "proof" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" SERIAL NOT NULL,
    "startNodeId" INTEGER NOT NULL,
    "endNodeId" INTEGER,
    "label" TEXT NOT NULL,
    "thumbnail" TEXT,
    "claimId" INTEGER NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "nodeUri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entType" "EntityType" NOT NULL,
    "descrip" TEXT NOT NULL,
    "image" TEXT,
    "thumbnail" TEXT,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "name" TEXT,
    "authType" "AuthType" NOT NULL DEFAULT 'PASSWORD',
    "authProviderId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restore_claim" (
    "id" INTEGER,
    "subject" TEXT,
    "claim" TEXT,
    "object" TEXT,
    "statement" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "sourceURI" TEXT,
    "howKnown" "HowKnown",
    "dateObserved" TIMESTAMP(3),
    "digestMultibase" TEXT,
    "author" TEXT,
    "curator" TEXT,
    "aspect" TEXT,
    "score" DOUBLE PRECISION,
    "stars" INTEGER,
    "amt" DOUBLE PRECISION,
    "unit" TEXT,
    "howMeasured" TEXT,
    "intendedAudience" TEXT,
    "respondAt" TEXT,
    "confidence" DOUBLE PRECISION,
    "issuerId" TEXT,
    "issuerIdType" "IssuerIdType",
    "claimAddress" TEXT,
    "proof" TEXT,
    "createdAt" TIMESTAMP(3),
    "lastUpdatedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "ClaimData" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ClaimData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "digestMultibase" TEXT,
    "metadata" JSONB,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidUserInfo_claimId_key" ON "CandidUserInfo"("claimId");

-- CreateIndex
CREATE INDEX "idx_edge_claimid" ON "Edge"("claimId");

-- CreateIndex
CREATE INDEX "idx_endnodeid" ON "Edge"("endNodeId");

-- CreateIndex
CREATE INDEX "idx_startnodeid" ON "Edge"("startNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimData_claimId_key" ON "ClaimData"("claimId");

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_endNodeId_fkey" FOREIGN KEY ("endNodeId") REFERENCES "Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_startNodeId_fkey" FOREIGN KEY ("startNodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ClaimData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;