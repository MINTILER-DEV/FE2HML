export type GameType = "FE2" | "TRIA";
export type MapStatus = "MAIN" | "LEGACY" | "REMOVED" | "PENDING";
export type SubmissionStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type Role = "USER" | "MODERATOR" | "ADMIN";

export type MapView = {
  id: string;
  slug: string;
  name: string;
  gameType: GameType;
  status: MapStatus;
  placement: number | null;
  difficultyScore: number;
  creators: string[];
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  showcaseUrl: string;
  robloxUrl: string;
  verifierStatus: string;
  isTeamMap: boolean;
  recordRequirementText: string;
  minimumRecordPercent: number;
  dateAdded: string;
  dateLastMoved: string;
  listMovement: number;
  tags: string[];
  acceptedRecordsCount: number;
};

export type RecordView = {
  id: string;
  playerSlug: string;
  playerName: string;
  mapSlug: string;
  mapName: string;
  gameType: GameType;
  percent: number;
  isCompletion: boolean;
  proofUrl: string;
  rawFootageUrl?: string;
  notes?: string;
  pointsAwarded: number;
  createdAt: string;
  teammates: string[];
};

export type PlayerView = {
  id: string;
  slug: string;
  username: string;
  totalPoints: number;
  hardestMapSlug: string;
  hardestMapName: string;
  totalAcceptedRecords: number;
  fe2RecordCount: number;
  triaRecordCount: number;
  rank: number;
  region?: string;
  joinedAt: string;
  avatarSeed: string;
};

export type PendingRecordView = {
  id: string;
  playerUsername: string;
  mapName: string;
  gameType: GameType;
  percent: number;
  isCompletion: boolean;
  proofUrl: string;
  status: SubmissionStatus;
  createdAt: string;
  notes?: string;
};

export type PendingMapView = {
  id: string;
  name: string;
  gameType: GameType;
  creatorText: string;
  estimatedDifficulty: number;
  status: SubmissionStatus;
  createdAt: string;
};

export type AnnouncementView = {
  id: string;
  title: string;
  body: string;
  severity: "INFO" | "SUCCESS" | "WARNING";
  isPinned: boolean;
  publishedAt: string;
};

export type SnapshotView = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  capturedAt: string;
  leaders: { placement: number; mapName: string; mapSlug: string; gameType: GameType }[];
};
