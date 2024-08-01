/*
  Warnings:

  - The `response` column on the `ValidationRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `restore_claim` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[validationClaimId]` on the table `ValidationRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candid_entity_id` to the `CandidUserInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('GREEN', 'YELLOW', 'GREY', 'RED');

-- DropIndex
DROP INDEX "idx_edge_claimid";

-- DropIndex
DROP INDEX "idx_endnodeid";

-- DropIndex
DROP INDEX "idx_startnodeid";

-- AlterTable
ALTER TABLE "CandidUserInfo" ADD COLUMN     "candid_entity_id" TEXT NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ValidationRequest" ADD COLUMN     "validationClaimId" INTEGER,
DROP COLUMN "response",
ADD COLUMN     "response" "ResponseStatus";

-- DropTable
DROP TABLE "restore_claim";

-- CreateIndex
CREATE UNIQUE INDEX "ValidationRequest_validationClaimId_key" ON "ValidationRequest"("validationClaimId");
