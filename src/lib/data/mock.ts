import type {
  AnnouncementView,
  MapView,
  PendingMapView,
  PendingRecordView,
  PlayerView,
  RecordView,
  SnapshotView,
} from "@/types/site";

const announcements: AnnouncementView[] = [
  {
    id: "announcement-empty-launch",
    title: "List ready for first entries",
    body: "The production roster launches empty by default. Moderators and admins can add the first FE2CM and TRIA.os maps from the admin panel.",
    severity: "INFO",
    isPinned: true,
    publishedAt: new Date("2026-04-09T12:00:00.000Z").toISOString(),
  },
];

export const mockData: {
  maps: MapView[];
  activeMaps: MapView[];
  acceptedRecords: RecordView[];
  players: PlayerView[];
  pendingRecordSubmissions: PendingRecordView[];
  pendingMapSubmissions: PendingMapView[];
  announcements: AnnouncementView[];
  snapshots: SnapshotView[];
} = {
  maps: [],
  activeMaps: [],
  acceptedRecords: [],
  players: [],
  pendingRecordSubmissions: [],
  pendingMapSubmissions: [],
  announcements,
  snapshots: [],
};
