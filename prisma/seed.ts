import bcrypt from "bcryptjs";
import { PrismaClient, Role, SubmissionStatus } from "@prisma/client";

import { mockData } from "../src/lib/data/mock";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo-pass-123", 10);

  await prisma.recordTeammate.deleteMany();
  await prisma.acceptedRecord.deleteMany();
  await prisma.recordSubmission.deleteMany();
  await prisma.mapSubmission.deleteMany();
  await prisma.snapshotEntry.deleteMany();
  await prisma.listSnapshot.deleteMany();
  await prisma.placementHistory.deleteMany();
  await prisma.mapTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.mapCreator.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.playerProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.map.deleteMany();

  const tagLookup = new Map<string, string>();

  for (const label of new Set(mockData.maps.flatMap((map) => map.tags))) {
    const tag = await prisma.tag.create({
      data: {
        label,
        slug: slugify(label),
        category: ["solo", "team"].includes(label) ? "format" : "skillset",
      },
    });
    tagLookup.set(label, tag.id);
  }

  const seededUsers = await Promise.all(
    mockData.players.map((player, index) =>
      prisma.user.create({
        data: {
          email: `${player.slug}@fhml.local`,
          name: player.username,
          hashedPassword: passwordHash,
          role:
            index === 0
              ? Role.ADMIN
              : index < 3
                ? Role.MODERATOR
                : Role.USER,
          playerProfile: {
            create: {
              slug: player.slug,
              username: player.username,
              region: player.region,
              joinedAt: new Date(player.joinedAt),
              totalPoints: player.totalPoints,
              avatarUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${player.avatarSeed}`,
            },
          },
        },
        include: { playerProfile: true },
      }),
    ),
  );

  const mapLookup = new Map<string, string>();

  for (const map of mockData.maps) {
    const createdMap = await prisma.map.create({
      data: {
        slug: map.slug,
        name: map.name,
        gameType: map.gameType,
        status: map.status,
        placement: map.placement,
        difficultyScore: map.difficultyScore,
        shortDescription: map.shortDescription,
        description: map.description,
        thumbnailUrl: map.thumbnailUrl,
        bannerUrl: map.thumbnailUrl,
        showcaseUrl: map.showcaseUrl,
        robloxUrl: map.robloxUrl,
        verifierStatus: map.verifierStatus,
        isTeamMap: map.isTeamMap,
        recordRequirementText: map.recordRequirementText,
        minimumRecordPercent: map.minimumRecordPercent,
        listMovement: map.listMovement,
        dateAdded: new Date(map.dateAdded),
        dateLastMoved: new Date(map.dateLastMoved),
        creators: {
          create: map.creators.map((creator, sortOrder) => ({
            name: creator,
            sortOrder,
          })),
        },
        tags: {
          create: map.tags.map((tag) => ({
            tagId: tagLookup.get(tag)!,
          })),
        },
      },
    });

    mapLookup.set(map.slug, createdMap.id);

    if (map.status === "MAIN" || map.status === "LEGACY") {
      await prisma.placementHistory.create({
        data: {
          mapId: createdMap.id,
          oldPlacement: map.placement ? map.placement + map.listMovement : null,
          newPlacement: map.placement,
          reason:
            map.listMovement === 0
              ? "Season refresh"
              : map.listMovement > 0
                ? "Placement gain after review"
                : "Placement drop after rebalance",
          changedAt: new Date(map.dateLastMoved),
        },
      });
    }
  }

  const playerLookup = new Map(
    seededUsers.map((user) => [user.playerProfile!.slug, user.playerProfile!.id]),
  );

  for (const record of mockData.acceptedRecords) {
    const acceptedRecord = await prisma.acceptedRecord.create({
      data: {
        playerId: playerLookup.get(record.playerSlug)!,
        mapId: mapLookup.get(record.mapSlug)!,
        percent: record.percent,
        isCompletion: record.isCompletion,
        proofUrl: record.proofUrl,
        rawFootageUrl: record.rawFootageUrl,
        placementAtTimeOfAcceptance:
          mockData.maps.find((map) => map.slug === record.mapSlug)?.placement ?? 0,
        pointsAwarded: record.pointsAwarded,
        createdAt: new Date(record.createdAt),
        teammates: {
          create: record.teammates.map((teammate, sortOrder) => ({
            displayName: teammate,
            sortOrder,
            playerId: playerLookup.get(slugify(teammate)),
          })),
        },
      },
    });

    await prisma.map.update({
      where: { id: mapLookup.get(record.mapSlug)! },
      data: {
        acceptedRecords: { connect: { id: acceptedRecord.id } },
      },
    });
  }

  for (const submission of mockData.pendingRecordSubmissions) {
    const map = mockData.maps.find((entry) => entry.name === submission.mapName)!;
    const submittingUser =
      seededUsers.find(
        (user) => user.playerProfile?.username === submission.playerUsername,
      ) ?? seededUsers[0];

    await prisma.recordSubmission.create({
      data: {
        submittedById: submittingUser.id,
        playerId: submittingUser.playerProfile?.id,
        mapId: mapLookup.get(map.slug)!,
        percent: submission.percent,
        isCompletion: submission.isCompletion,
        proofUrl: submission.proofUrl,
        notes: submission.notes,
        status: SubmissionStatus.PENDING,
        createdAt: new Date(submission.createdAt),
      },
    });
  }

  for (const submission of mockData.pendingMapSubmissions) {
    await prisma.mapSubmission.create({
      data: {
        submittedById: seededUsers[0].id,
        name: submission.name,
        slug: slugify(submission.name),
        gameType: submission.gameType,
        creatorText: submission.creatorText,
        estimatedDifficulty: submission.estimatedDifficulty,
        description:
          "Placeholder candidate entry created by the seed script for moderation workflow testing.",
        status: SubmissionStatus.PENDING,
        createdAt: new Date(submission.createdAt),
      },
    });
  }

  for (const announcement of mockData.announcements) {
    await prisma.announcement.create({
      data: {
        slug: slugify(announcement.title),
        title: announcement.title,
        body: announcement.body,
        severity: announcement.severity,
        isPinned: announcement.isPinned,
        publishedAt: new Date(announcement.publishedAt),
        authorId: seededUsers[0].id,
      },
    });
  }

  for (const snapshot of mockData.snapshots) {
    await prisma.listSnapshot.create({
      data: {
        slug: snapshot.slug,
        title: snapshot.title,
        summary: snapshot.summary,
        capturedAt: new Date(snapshot.capturedAt),
        createdById: seededUsers[0].id,
        entries: {
          create: snapshot.leaders.map((leader) => {
            const map = mockData.maps.find((entry) => entry.slug === leader.mapSlug)!;

            return {
              mapId: mapLookup.get(leader.mapSlug)!,
              placement: leader.placement,
              status: map.status,
              difficultyScore: map.difficultyScore,
              gameType: leader.gameType,
            };
          }),
        },
      },
    });
  }

  for (const player of mockData.players) {
    const profileId = playerLookup.get(player.slug)!;
    const hardestMapId = mapLookup.get(player.hardestMapSlug)!;

    await prisma.playerProfile.update({
      where: { id: profileId },
      data: { hardestMapId },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
