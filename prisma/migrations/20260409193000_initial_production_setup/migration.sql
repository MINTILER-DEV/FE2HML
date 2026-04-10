-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('FE2', 'TRIA');

-- CreateEnum
CREATE TYPE "MapStatus" AS ENUM ('MAIN', 'LEGACY', 'REMOVED', 'PENDING');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AnnouncementSeverity" AS ENUM ('INFO', 'SUCCESS', 'WARNING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hashedPassword" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "slug" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "region" TEXT,
    "avatarUrl" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hardestMapId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "mapCode" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "status" "MapStatus" NOT NULL DEFAULT 'PENDING',
    "placement" INTEGER,
    "difficultyScore" DOUBLE PRECISION NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "bannerUrl" TEXT,
    "showcaseUrl" TEXT,
    "robloxUrl" TEXT,
    "verifierStatus" TEXT,
    "isTeamMap" BOOLEAN NOT NULL DEFAULT false,
    "recordRequirementText" TEXT NOT NULL,
    "minimumRecordPercent" INTEGER NOT NULL DEFAULT 100,
    "listMovement" INTEGER NOT NULL DEFAULT 0,
    "dateAdded" TIMESTAMP(3),
    "dateLastMoved" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapCreator" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleLabel" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MapCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapTag" (
    "mapId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "MapTag_pkey" PRIMARY KEY ("mapId","tagId")
);

-- CreateTable
CREATE TABLE "RecordSubmission" (
    "id" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "playerId" TEXT,
    "mapId" TEXT NOT NULL,
    "percent" INTEGER NOT NULL,
    "isCompletion" BOOLEAN NOT NULL DEFAULT false,
    "proofUrl" TEXT NOT NULL,
    "rawFootageUrl" TEXT,
    "notes" TEXT,
    "platform" TEXT,
    "teammatesText" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "moderatorMessage" TEXT,
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecordSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcceptedRecord" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "submissionId" TEXT,
    "percent" INTEGER NOT NULL,
    "isCompletion" BOOLEAN NOT NULL DEFAULT false,
    "proofUrl" TEXT NOT NULL,
    "rawFootageUrl" TEXT,
    "placementAtTimeOfAcceptance" INTEGER NOT NULL,
    "pointsAwarded" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcceptedRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapSubmission" (
    "id" TEXT NOT NULL,
    "submittedById" TEXT NOT NULL,
    "proposedMapCode" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "gameType" "GameType" NOT NULL,
    "creatorText" TEXT NOT NULL,
    "robloxUrl" TEXT,
    "showcaseUrl" TEXT,
    "thumbnailUrl" TEXT,
    "estimatedDifficulty" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "isTeamMap" BOOLEAN NOT NULL DEFAULT false,
    "skillsetText" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "moderatorMessage" TEXT,
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListSnapshot" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "ListSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnapshotEntry" (
    "snapshotId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "placement" INTEGER,
    "status" "MapStatus" NOT NULL,
    "difficultyScore" DOUBLE PRECISION NOT NULL,
    "gameType" "GameType" NOT NULL,

    CONSTRAINT "SnapshotEntry_pkey" PRIMARY KEY ("snapshotId","mapId")
);

-- CreateTable
CREATE TABLE "PlacementHistory" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "oldPlacement" INTEGER,
    "newPlacement" INTEGER,
    "reason" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlacementHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "severity" "AnnouncementSeverity" NOT NULL DEFAULT 'INFO',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeratorNote" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "mapId" TEXT,
    "recordSubmissionId" TEXT,
    "mapSubmissionId" TEXT,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModeratorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordTeammate" (
    "id" TEXT NOT NULL,
    "acceptedRecordId" TEXT,
    "recordSubmissionId" TEXT,
    "playerId" TEXT,
    "displayName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecordTeammate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_userId_key" ON "PlayerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_slug_key" ON "PlayerProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_username_key" ON "PlayerProfile"("username");

-- CreateIndex
CREATE INDEX "PlayerProfile_totalPoints_idx" ON "PlayerProfile"("totalPoints" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Map_mapCode_key" ON "Map"("mapCode");

-- CreateIndex
CREATE UNIQUE INDEX "Map_slug_key" ON "Map"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Map_name_key" ON "Map"("name");

-- CreateIndex
CREATE INDEX "Map_gameType_status_placement_idx" ON "Map"("gameType", "status", "placement" ASC);

-- CreateIndex
CREATE INDEX "Map_slug_status_idx" ON "Map"("slug", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MapCreator_mapId_name_key" ON "MapCreator"("mapId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "RecordSubmission_status_createdAt_idx" ON "RecordSubmission"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "RecordSubmission_submittedById_createdAt_idx" ON "RecordSubmission"("submittedById", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "AcceptedRecord_submissionId_key" ON "AcceptedRecord"("submissionId");

-- CreateIndex
CREATE INDEX "AcceptedRecord_mapId_createdAt_idx" ON "AcceptedRecord"("mapId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "AcceptedRecord_playerId_createdAt_idx" ON "AcceptedRecord"("playerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "MapSubmission_status_createdAt_idx" ON "MapSubmission"("status", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ListSnapshot_slug_key" ON "ListSnapshot"("slug");

-- CreateIndex
CREATE INDEX "SnapshotEntry_gameType_placement_idx" ON "SnapshotEntry"("gameType", "placement" ASC);

-- CreateIndex
CREATE INDEX "PlacementHistory_mapId_changedAt_idx" ON "PlacementHistory"("mapId", "changedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Announcement_slug_key" ON "Announcement"("slug");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_hardestMapId_fkey" FOREIGN KEY ("hardestMapId") REFERENCES "Map"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapCreator" ADD CONSTRAINT "MapCreator_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapTag" ADD CONSTRAINT "MapTag_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapTag" ADD CONSTRAINT "MapTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordSubmission" ADD CONSTRAINT "RecordSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordSubmission" ADD CONSTRAINT "RecordSubmission_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "PlayerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordSubmission" ADD CONSTRAINT "RecordSubmission_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordSubmission" ADD CONSTRAINT "RecordSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptedRecord" ADD CONSTRAINT "AcceptedRecord_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "PlayerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptedRecord" ADD CONSTRAINT "AcceptedRecord_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcceptedRecord" ADD CONSTRAINT "AcceptedRecord_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "RecordSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapSubmission" ADD CONSTRAINT "MapSubmission_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapSubmission" ADD CONSTRAINT "MapSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSnapshot" ADD CONSTRAINT "ListSnapshot_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotEntry" ADD CONSTRAINT "SnapshotEntry_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "ListSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnapshotEntry" ADD CONSTRAINT "SnapshotEntry_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementHistory" ADD CONSTRAINT "PlacementHistory_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorNote" ADD CONSTRAINT "ModeratorNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorNote" ADD CONSTRAINT "ModeratorNote_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorNote" ADD CONSTRAINT "ModeratorNote_recordSubmissionId_fkey" FOREIGN KEY ("recordSubmissionId") REFERENCES "RecordSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorNote" ADD CONSTRAINT "ModeratorNote_mapSubmissionId_fkey" FOREIGN KEY ("mapSubmissionId") REFERENCES "MapSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordTeammate" ADD CONSTRAINT "RecordTeammate_acceptedRecordId_fkey" FOREIGN KEY ("acceptedRecordId") REFERENCES "AcceptedRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordTeammate" ADD CONSTRAINT "RecordTeammate_recordSubmissionId_fkey" FOREIGN KEY ("recordSubmissionId") REFERENCES "RecordSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordTeammate" ADD CONSTRAINT "RecordTeammate_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "PlayerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

