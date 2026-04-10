import { computeRecordPoints } from "@/lib/scoring";
import { slugify } from "@/lib/utils";
import type {
  AnnouncementView,
  MapView,
  PendingMapView,
  PendingRecordView,
  PlayerView,
  RecordView,
  SnapshotView,
} from "@/types/site";

const creatorPool = [
  "Aster Dock",
  "Glyph Harbor",
  "Nova Finch",
  "Rift Ladder",
  "Tide Hex",
  "Copper Vale",
  "Signal Bloom",
  "Delta Quarry",
  "Morrow Kite",
  "Axis Lantern",
];

const playerPool = [
  "AblazePixel",
  "CascadeKite",
  "DialedVoid",
  "EchoHarbor",
  "FluxScribe",
  "GraniteBlink",
  "HexaRipple",
  "IonPrism",
  "JadeVector",
  "KiteParallax",
  "LumaForge",
  "MicaDrift",
  "NadirShift",
  "OrbitSignal",
  "PillarVast",
];

const mapTags = [
  ["solo", "precision"],
  ["solo", "endurance"],
  ["team", "coordination"],
  ["solo", "timing"],
  ["solo", "route"],
  ["team", "length"],
];

const fe2Names = [
  "Abyssal Relay",
  "Voltage Catacomb",
  "Silted Skyline",
  "Crimson Spillway",
  "Drift Archive",
  "Basalt Conduit",
  "Static Monsoon",
  "Prism Undertow",
  "Ashen Motorway",
  "Turbine Hollow",
  "Glasshead Vault",
  "Wireframe Rapids",
  "Rust Meridian",
  "Fracture Harbor",
  "Mercury Lattice",
  "Shiver Intake",
  "Rationed Depths",
  "Breach Forecast",
  "Severed Beacon",
  "Flooded Causeway",
];

const triaNames = [
  "Null Bloom",
  "Chrome Deluge",
  "Eclipse Stack",
  "Obsidian Tempo",
  "Signal Ruin",
  "Hollow Transit",
  "Raincode",
  "Pulse Quarry",
  "Ferric Tide",
  "Monolith Sprint",
  "Afterline",
  "Sable Overflow",
  "Pinned Horizon",
  "Deepcore Runoff",
  "Vaultline Echo",
  "Silent Battery",
  "Terminal Spray",
  "Quartz Intake",
  "Vector Cascade",
  "Coalition Wake",
];

function isoDate(offsetDays: number) {
  const base = new Date("2026-04-09T12:00:00.000Z");
  base.setUTCDate(base.getUTCDate() + offsetDays);
  return base.toISOString();
}

function makeMap(
  gameType: "FE2" | "TRIA",
  name: string,
  index: number,
): MapView {
  const status = index < 16 ? "MAIN" : "LEGACY";
  const placement = status === "MAIN" ? index + 1 : null;
  const tags = mapTags[index % mapTags.length];
  const difficultyScore =
    gameType === "FE2" ? 99 - index * 2.1 : 98.3 - index * 2.05;

  return {
    id: `${gameType.toLowerCase()}-map-${index + 1}`,
    slug: slugify(`${name}-${gameType}`),
    name,
    gameType,
    status,
    placement,
    difficultyScore: Number(difficultyScore.toFixed(1)),
    creators: [
      creatorPool[index % creatorPool.length],
      creatorPool[(index + 3) % creatorPool.length],
    ],
    shortDescription:
      gameType === "FE2"
        ? "Pressure-heavy routing with aggressive water timings."
        : "Fast precision chains with tight recovery windows.",
    description:
      "A fictional high-end community map built for testing submissions, placement movement, and leaderboard features across a competitive ranking site.",
    thumbnailUrl: `https://placehold.co/960x540/0f172a/22d3ee?text=${encodeURIComponent(name)}`,
    showcaseUrl: `https://youtu.be/${gameType.toLowerCase()}${index + 11}demo`,
    robloxUrl: `https://www.roblox.com/games/${810000 + index}/${slugify(name)}`,
    verifierStatus: index % 4 === 0 ? "Verified" : "Open Verification",
    isTeamMap: tags.includes("team"),
    recordRequirementText:
      status === "MAIN"
        ? "Raw footage preferred, no cuts, visible username required."
        : "Full completion or qualifying progress with clear HUD.",
    minimumRecordPercent: tags.includes("team") ? 55 : 60,
    dateAdded: isoDate(-140 + index * 4),
    dateLastMoved: isoDate(-18 + (index % 5)),
    listMovement: index % 5 === 0 ? 2 : index % 4 === 0 ? -1 : 0,
    tags,
    acceptedRecordsCount: 0,
  };
}

const allMaps = [
  ...fe2Names.map((name, index) => makeMap("FE2", name, index)),
  ...triaNames.map((name, index) => makeMap("TRIA", name, index)),
];

const activeMaps = allMaps.filter((map) => map.status === "MAIN");

const acceptedRecords: RecordView[] = activeMaps.flatMap((map, index) => {
  const firstPlayer = playerPool[index % playerPool.length];
  const secondPlayer = playerPool[(index * 2 + 5) % playerPool.length];
  const records: RecordView[] = [];

  records.push({
    id: `record-${map.slug}-1`,
    playerSlug: slugify(firstPlayer),
    playerName: firstPlayer,
    mapSlug: map.slug,
    mapName: map.name,
    gameType: map.gameType,
    percent: 100,
    isCompletion: true,
    proofUrl: `https://youtu.be/proof-${map.slug}-1`,
    rawFootageUrl: `https://streamable.com/raw-${map.slug}-1`,
    notes: map.isTeamMap ? "Team clear with synced lever split." : undefined,
    pointsAwarded: computeRecordPoints({
      difficultyScore: map.difficultyScore,
      placement: map.placement ?? 25,
      isCompletion: true,
      percent: 100,
      isTeamMap: map.isTeamMap,
    }),
    createdAt: isoDate(-28 + index),
    teammates: map.isTeamMap ? [playerPool[(index + 7) % playerPool.length]] : [],
  });

  if (index % 3 !== 0) {
    const percent = 68 + (index % 6) * 5;
    records.push({
      id: `record-${map.slug}-2`,
      playerSlug: slugify(secondPlayer),
      playerName: secondPlayer,
      mapSlug: map.slug,
      mapName: map.name,
      gameType: map.gameType,
      percent,
      isCompletion: percent >= 100,
      proofUrl: `https://medal.tv/games/roblox/clips/${map.slug}-2`,
      notes: percent >= 100 ? "Clean replay with facecam overlay." : "Late run improvement.",
      pointsAwarded: computeRecordPoints({
        difficultyScore: map.difficultyScore,
        placement: map.placement ?? 25,
        isCompletion: percent >= 100,
        percent,
        isTeamMap: map.isTeamMap,
      }),
      createdAt: isoDate(-20 + index),
      teammates: [],
    });
  }

  if (map.isTeamMap && index % 4 === 0) {
    const leader = playerPool[(index + 2) % playerPool.length];
    records.push({
      id: `record-${map.slug}-3`,
      playerSlug: slugify(leader),
      playerName: leader,
      mapSlug: map.slug,
      mapName: map.name,
      gameType: map.gameType,
      percent: 100,
      isCompletion: true,
      proofUrl: `https://youtu.be/team-${map.slug}-3`,
      pointsAwarded: computeRecordPoints({
        difficultyScore: map.difficultyScore,
        placement: map.placement ?? 25,
        isCompletion: true,
        percent: 100,
        isTeamMap: true,
      }),
      createdAt: isoDate(-10 + index),
      teammates: [firstPlayer, secondPlayer],
    });
  }

  return records;
});

for (const map of allMaps) {
  map.acceptedRecordsCount = acceptedRecords.filter(
    (record) => record.mapSlug === map.slug,
  ).length;
}

const players: PlayerView[] = playerPool
  .map((username, index) => {
    const playerRecords = acceptedRecords.filter(
      (record) => record.playerName === username,
    );
    const totalPoints = playerRecords.reduce(
      (sum, record) => sum + record.pointsAwarded,
      0,
    );
    const hardestRecord = [...playerRecords].sort(
      (left, right) =>
        (activeMaps.find((map) => map.slug === left.mapSlug)?.placement ?? 999) -
        (activeMaps.find((map) => map.slug === right.mapSlug)?.placement ?? 999),
    )[0];

    return {
      id: `player-${index + 1}`,
      slug: slugify(username),
      username,
      totalPoints: Number(totalPoints.toFixed(2)),
      hardestMapSlug: hardestRecord?.mapSlug ?? activeMaps[0].slug,
      hardestMapName: hardestRecord?.mapName ?? activeMaps[0].name,
      totalAcceptedRecords: playerRecords.length,
      fe2RecordCount: playerRecords.filter((record) => record.gameType === "FE2").length,
      triaRecordCount: playerRecords.filter((record) => record.gameType === "TRIA").length,
      rank: 0,
      region: ["US", "CA", "GB", "PH", "DE", "AU"][index % 6],
      joinedAt: isoDate(-360 + index * 11),
      avatarSeed: username.toLowerCase(),
    };
  })
  .sort((left, right) => right.totalPoints - left.totalPoints)
  .map((player, index) => ({ ...player, rank: index + 1 }));

const pendingRecordSubmissions: PendingRecordView[] = [
  {
    id: "pending-record-1",
    playerUsername: "AblazePixel",
    mapName: "Null Bloom",
    gameType: "TRIA",
    percent: 84,
    isCompletion: false,
    proofUrl: "https://youtu.be/pending-null-bloom",
    status: "PENDING",
    createdAt: isoDate(-2),
    notes: "Run has full HUD and live comms audio.",
  },
  {
    id: "pending-record-2",
    playerUsername: "GraniteBlink",
    mapName: "Abyssal Relay",
    gameType: "FE2",
    percent: 100,
    isCompletion: true,
    proofUrl: "https://youtu.be/pending-abyssal-relay",
    status: "PENDING",
    createdAt: isoDate(-3),
  },
  {
    id: "pending-record-3",
    playerUsername: "OrbitSignal",
    mapName: "Chrome Deluge",
    gameType: "TRIA",
    percent: 76,
    isCompletion: false,
    proofUrl: "https://medal.tv/games/roblox/clips/chrome-deluge-pending",
    status: "PENDING",
    createdAt: isoDate(-1),
  },
];

const pendingMapSubmissions: PendingMapView[] = [
  {
    id: "pending-map-1",
    name: "Spectral Spill",
    gameType: "FE2",
    creatorText: "Glyph Harbor, Signal Bloom",
    estimatedDifficulty: 85.2,
    status: "PENDING",
    createdAt: isoDate(-4),
  },
  {
    id: "pending-map-2",
    name: "Rupture Broadcast",
    gameType: "TRIA",
    creatorText: "Axis Lantern",
    estimatedDifficulty: 82.8,
    status: "PENDING",
    createdAt: isoDate(-3),
  },
  {
    id: "pending-map-3",
    name: "Copper Wake",
    gameType: "FE2",
    creatorText: "Nova Finch",
    estimatedDifficulty: 79.9,
    status: "PENDING",
    createdAt: isoDate(-1),
  },
];

const announcements: AnnouncementView[] = [
  {
    id: "announcement-1",
    title: "Spring rules refresh",
    body: "Raw footage is now strongly recommended for top-10 completions and all moderator review notes are visible on accepted records.",
    severity: "INFO",
    isPinned: true,
    publishedAt: isoDate(-5),
  },
  {
    id: "announcement-2",
    title: "TRIA leaderboard recalibration",
    body: "Difficulty scores were rebalanced for placements 11 to 20 to tighten score spread in the lower main list.",
    severity: "SUCCESS",
    isPinned: false,
    publishedAt: isoDate(-12),
  },
  {
    id: "announcement-3",
    title: "Moderator applications reopened",
    body: "Experienced record reviewers can apply through the community form. Knowledge of FE2CM and TRIA verification standards is preferred.",
    severity: "WARNING",
    isPinned: false,
    publishedAt: isoDate(-18),
  },
];

const snapshots: SnapshotView[] = [
  {
    id: "snapshot-1",
    slug: "2026-preseason",
    title: "Preseason Snapshot",
    summary: "The first combined archive used for internal calibration before public launch.",
    capturedAt: isoDate(-90),
    leaders: activeMaps.slice(0, 5).map((map, index) => ({
      placement: index + 1,
      mapName: map.name,
      mapSlug: map.slug,
      gameType: map.gameType,
    })),
  },
  {
    id: "snapshot-2",
    slug: "2026-midseason",
    title: "Midseason Snapshot",
    summary: "A rebalance window with several FE2 and TRIA swaps near the top 10.",
    capturedAt: isoDate(-45),
    leaders: [...activeMaps]
      .sort((left, right) => left.difficultyScore - right.difficultyScore)
      .slice(0, 5)
      .map((map, index) => ({
        placement: index + 1,
        mapName: map.name,
        mapSlug: map.slug,
        gameType: map.gameType,
      })),
  },
  {
    id: "snapshot-3",
    slug: "2026-current",
    title: "Current Snapshot",
    summary: "Latest public archive for the active main list and score ladder.",
    capturedAt: isoDate(-3),
    leaders: activeMaps.slice(0, 5).map((map, index) => ({
      placement: index + 1,
      mapName: map.name,
      mapSlug: map.slug,
      gameType: map.gameType,
    })),
  },
];

export const mockData = {
  maps: allMaps,
  activeMaps,
  acceptedRecords,
  players,
  pendingRecordSubmissions,
  pendingMapSubmissions,
  announcements,
  snapshots,
};
