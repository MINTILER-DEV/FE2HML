import {
  GameType,
  MapStatus,
  SubmissionStatus,
  type AcceptedRecord,
  type Map,
} from "@prisma/client";

import { getDifficultyLabel, normalizeDifficultyScore } from "@/lib/difficulty";
import { mockData } from "@/lib/data/mock";
import { prisma } from "@/lib/prisma";
import type {
  AnnouncementView,
  MapView,
  PendingMapView,
  PendingRecordView,
  PlayerView,
  RecordView,
  SnapshotView,
} from "@/types/site";

const useDatabase = Boolean(process.env.DATABASE_URL);

type RankingMode = "combined" | "fe2" | "tria";
type RankingSort = "placement" | "difficulty" | "records" | "newest";

function normalizeMap(
  map: Map & {
    creators: { name: string }[];
    tags: { tag: { label: string } }[];
    _count?: { acceptedRecords: number };
  },
): MapView {
  const difficultyScore = normalizeDifficultyScore(map.difficultyScore);

  return {
    id: map.id,
    mapCode: map.mapCode,
    slug: map.slug,
    name: map.name,
    gameType: map.gameType,
    status: map.status,
    placement: map.placement,
    difficultyScore,
    difficultyLabel: getDifficultyLabel(difficultyScore),
    creators: map.creators.map((creator) => creator.name),
    shortDescription: map.shortDescription ?? "Competitive map listing entry.",
    description: map.description,
    thumbnailUrl:
      map.thumbnailUrl ??
      `https://placehold.co/960x540/0f172a/22d3ee?text=${encodeURIComponent(map.name)}`,
    showcaseUrl: map.showcaseUrl ?? "",
    robloxUrl: map.robloxUrl ?? "",
    verifierStatus: map.verifierStatus ?? "Pending Verification",
    isTeamMap: map.isTeamMap,
    recordRequirementText: map.recordRequirementText,
    minimumRecordPercent: map.minimumRecordPercent,
    dateAdded: map.dateAdded?.toISOString() ?? map.createdAt.toISOString(),
    dateLastMoved: map.dateLastMoved?.toISOString() ?? map.updatedAt.toISOString(),
    listMovement: map.listMovement,
    tags: map.tags.map((tag) => tag.tag.label),
    acceptedRecordsCount: map._count?.acceptedRecords ?? 0,
  };
}

function normalizeRecord(
  record: AcceptedRecord & {
    player: { slug: string; username: string };
    map: { mapCode: string; name: string; gameType: GameType };
    teammates: { displayName: string }[];
  },
): RecordView {
  return {
    id: record.id,
    playerSlug: record.player.slug,
    playerName: record.player.username,
    mapCode: record.map.mapCode,
    mapName: record.map.name,
    gameType: record.map.gameType,
    percent: record.percent,
    isCompletion: record.isCompletion,
    proofUrl: record.proofUrl,
    rawFootageUrl: record.rawFootageUrl ?? undefined,
    notes: undefined,
    pointsAwarded: record.pointsAwarded,
    createdAt: record.createdAt.toISOString(),
    teammates: record.teammates.map((teammate) => teammate.displayName),
  };
}

function sortMaps(maps: MapView[], sort: RankingSort) {
  const list = [...maps];

  switch (sort) {
    case "difficulty":
      return list.sort((left, right) => right.difficultyScore - left.difficultyScore);
    case "records":
      return list.sort(
        (left, right) => right.acceptedRecordsCount - left.acceptedRecordsCount,
      );
    case "newest":
      return list.sort(
        (left, right) =>
          new Date(right.dateAdded).getTime() - new Date(left.dateAdded).getTime(),
      );
    default:
      return list.sort((left, right) => {
        const leftPlacement = left.placement ?? 999;
        const rightPlacement = right.placement ?? 999;
        return leftPlacement - rightPlacement;
      });
  }
}

export async function getAnnouncements(): Promise<AnnouncementView[]> {
  if (!useDatabase) {
    return mockData.announcements;
  }

  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      take: 5,
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      severity: announcement.severity as AnnouncementView["severity"],
      isPinned: announcement.isPinned,
      publishedAt: announcement.publishedAt.toISOString(),
    }));
  } catch {
    return mockData.announcements;
  }
}

export async function getRankingMaps({
  mode,
  status = "MAIN",
  search,
  sort = "placement",
}: {
  mode: RankingMode;
  status?: MapStatus;
  search?: string;
  sort?: RankingSort;
}) {
  const term = search?.toLowerCase().trim();

  const filterMap = (map: MapView) => {
    if (status && map.status !== status) {
      return false;
    }

    if (mode === "fe2" && map.gameType !== "FE2") {
      return false;
    }

    if (mode === "tria" && map.gameType !== "TRIA") {
      return false;
    }

    if (!term) {
      return true;
    }

    return (
      map.name.toLowerCase().includes(term) ||
      map.mapCode.toLowerCase().includes(term) ||
      map.creators.some((creator) => creator.toLowerCase().includes(term)) ||
      map.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  };

  if (!useDatabase) {
    return sortMaps(mockData.maps.filter(filterMap), sort);
  }

  try {
    const maps = await prisma.map.findMany({
      where: {
        status,
        ...(mode === "fe2" ? { gameType: "FE2" } : {}),
        ...(mode === "tria" ? { gameType: "TRIA" } : {}),
      },
      include: {
        creators: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
        _count: { select: { acceptedRecords: true } },
      },
      orderBy:
        sort === "difficulty"
          ? { difficultyScore: "desc" }
          : sort === "newest"
            ? { dateAdded: "desc" }
            : { placement: "asc" },
    });

    return sortMaps(maps.map(normalizeMap).filter(filterMap), sort);
  } catch {
    return sortMaps(mockData.maps.filter(filterMap), sort);
  }
}

export async function getManagedMaps(): Promise<MapView[]> {
  if (!useDatabase) {
    return mockData.maps;
  }

  try {
    const maps = await prisma.map.findMany({
      include: {
        creators: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
        _count: { select: { acceptedRecords: true } },
      },
      orderBy: [{ status: "asc" }, { placement: "asc" }, { createdAt: "desc" }],
    });

    return maps.map(normalizeMap);
  } catch {
    return mockData.maps;
  }
}

function emptyMapHistory() {
  return [] as { label: string; placement: number; capturedAt: string }[];
}

export async function getMapByCode(mapCode: string) {
  if (!useDatabase) {
    const map = mockData.maps.find((entry) => entry.mapCode === mapCode);
    if (!map) return null;

    return {
      map,
      records: mockData.acceptedRecords.filter((record) => record.mapCode === mapCode),
      history: emptyMapHistory(),
    };
  }

  try {
    const map = await prisma.map.findUnique({
      where: { mapCode },
      include: {
        creators: { orderBy: { sortOrder: "asc" } },
        tags: { include: { tag: true } },
        _count: { select: { acceptedRecords: true } },
        acceptedRecords: {
          include: {
            player: true,
            map: true,
            teammates: true,
          },
          orderBy: { createdAt: "desc" },
        },
        placementHistory: { orderBy: { changedAt: "desc" } },
      },
    });

    if (!map) {
      return null;
    }

    return {
      map: normalizeMap(map),
      records: map.acceptedRecords.map(normalizeRecord),
      history: map.placementHistory.map((entry) => ({
        label: entry.reason ?? "List update",
        placement: entry.newPlacement ?? entry.oldPlacement ?? 0,
        capturedAt: entry.changedAt.toISOString(),
      })),
    };
  } catch {
    const map = mockData.maps.find((entry) => entry.mapCode === mapCode);
    if (!map) return null;

    return {
      map,
      records: mockData.acceptedRecords.filter((record) => record.mapCode === mapCode),
      history: emptyMapHistory(),
    };
  }
}

export async function getPlayers(): Promise<PlayerView[]> {
  if (!useDatabase) {
    return mockData.players;
  }

  try {
    const players = await prisma.playerProfile.findMany({
      include: {
        hardestMap: true,
        acceptedRecords: {
          include: { map: true },
        },
      },
      orderBy: { totalPoints: "desc" },
    });

    return players.map((player, index) => {
      const fe2RecordCount = player.acceptedRecords.filter(
        (record) => record.map.gameType === "FE2",
      ).length;
      const triaRecordCount = player.acceptedRecords.filter(
        (record) => record.map.gameType === "TRIA",
      ).length;

      return {
        id: player.id,
        slug: player.slug,
        username: player.username,
        totalPoints: player.totalPoints,
        hardestMapCode: player.hardestMap?.mapCode,
        hardestMapName: player.hardestMap?.name ?? "No accepted records yet",
        totalAcceptedRecords: player.acceptedRecords.length,
        fe2RecordCount,
        triaRecordCount,
        rank: index + 1,
        region: player.region ?? undefined,
        joinedAt: player.joinedAt.toISOString(),
        avatarSeed: player.username.toLowerCase(),
      };
    });
  } catch {
    return mockData.players;
  }
}

export async function getPlayerBySlug(slug: string) {
  const players = await getPlayers();
  const player = players.find((entry) => entry.slug === slug);

  if (!player) {
    return null;
  }

  const records = useDatabase
    ? await prisma.acceptedRecord
        .findMany({
          where: { player: { slug } },
          include: {
            player: true,
            map: true,
            teammates: true,
          },
          orderBy: { createdAt: "desc" },
        })
        .then((entries) => entries.map(normalizeRecord))
        .catch(() =>
          mockData.acceptedRecords.filter((record) => record.playerSlug === slug),
        )
    : mockData.acceptedRecords.filter((record) => record.playerSlug === slug);

  return { player, records };
}

export async function getLatestAcceptedRecords(): Promise<RecordView[]> {
  if (!useDatabase) {
    return mockData.acceptedRecords.slice(0, 8);
  }

  try {
    const records = await prisma.acceptedRecord.findMany({
      include: {
        player: true,
        map: true,
        teammates: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return records.map(normalizeRecord);
  } catch {
    return mockData.acceptedRecords.slice(0, 8);
  }
}

export async function getModeratorDashboardData(): Promise<{
  pendingRecords: PendingRecordView[];
  pendingMaps: PendingMapView[];
  snapshots: SnapshotView[];
}> {
  if (!useDatabase) {
    return {
      pendingRecords: mockData.pendingRecordSubmissions,
      pendingMaps: mockData.pendingMapSubmissions,
      snapshots: mockData.snapshots,
    };
  }

  try {
    const [recordSubmissions, mapSubmissions, snapshots] = await Promise.all([
      prisma.recordSubmission.findMany({
        where: { status: SubmissionStatus.PENDING },
        include: { map: true, player: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.mapSubmission.findMany({
        where: { status: SubmissionStatus.PENDING },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.listSnapshot.findMany({
        include: {
          entries: {
            include: { map: true },
            orderBy: { placement: "asc" },
            take: 5,
          },
        },
        orderBy: { capturedAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      pendingRecords: recordSubmissions.map((submission) => ({
        id: submission.id,
        playerUsername:
          submission.player?.username ?? submission.submittedById.slice(0, 8),
        mapName: submission.map.name,
        gameType: submission.map.gameType,
        percent: submission.percent,
        isCompletion: submission.isCompletion,
        proofUrl: submission.proofUrl,
        status: submission.status,
        createdAt: submission.createdAt.toISOString(),
        notes: submission.notes ?? undefined,
      })),
      pendingMaps: mapSubmissions.map((submission) => ({
        id: submission.id,
        proposedMapCode: submission.proposedMapCode ?? undefined,
        name: submission.name,
        gameType: submission.gameType,
        creatorText: submission.creatorText,
        estimatedDifficulty: normalizeDifficultyScore(
          submission.estimatedDifficulty ?? 6,
        ),
        status: submission.status,
        createdAt: submission.createdAt.toISOString(),
      })),
      snapshots: snapshots.map((snapshot) => ({
        id: snapshot.id,
        slug: snapshot.slug,
        title: snapshot.title,
        summary: snapshot.summary ?? "Archived list state.",
        capturedAt: snapshot.capturedAt.toISOString(),
        leaders: snapshot.entries.map((entry) => ({
          placement: entry.placement ?? 0,
          mapName: entry.map.name,
          mapCode: entry.map.mapCode,
          gameType: entry.gameType,
        })),
      })),
    };
  } catch {
    return {
      pendingRecords: mockData.pendingRecordSubmissions,
      pendingMaps: mockData.pendingMapSubmissions,
      snapshots: mockData.snapshots,
    };
  }
}

export async function getHomeData() {
  const [maps, players, latestRecords, announcements] = await Promise.all([
    getRankingMaps({ mode: "combined", status: "MAIN" }),
    getPlayers(),
    getLatestAcceptedRecords(),
    getAnnouncements(),
  ]);

  const fe2Maps = maps.filter((map) => map.gameType === "FE2");
  const triaMaps = maps.filter((map) => map.gameType === "TRIA");

  return {
    stats: {
      totalRankedMaps: maps.length,
      fe2Maps: fe2Maps.length,
      triaMaps: triaMaps.length,
      totalVerifiedRecords: latestRecords.length,
      registeredPlayers: players.length,
    },
    featuredMaps: {
      fe2: fe2Maps[0] ?? null,
      tria: triaMaps[0] ?? null,
    },
    latestRecords,
    latestChanges: maps
      .filter((map) => map.listMovement !== 0)
      .slice(0, 6)
      .map((map) => ({
        mapName: map.name,
        mapCode: map.mapCode,
        movement: map.listMovement,
        updatedAt: map.dateLastMoved,
      })),
    announcements,
  };
}
