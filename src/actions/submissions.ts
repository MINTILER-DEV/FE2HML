"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeRecordPoints } from "@/lib/scoring";
import { buildProofDomainSet, parseCsv, slugify } from "@/lib/utils";
import {
  mapSubmissionSchema,
  recordSubmissionSchema,
} from "@/lib/validators/submission";

const useDatabase = Boolean(process.env.DATABASE_URL);

function getBooleanValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "true" || value === "on";
}

function assertAllowedProofDomain(urlString: string) {
  const allowedDomains = buildProofDomainSet();
  if (!allowedDomains.size) {
    return;
  }

  const hostname = new URL(urlString).hostname.replace(/^www\./, "").toLowerCase();
  const isAllowed = [...allowedDomains].some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );

  if (!isAllowed) {
    throw new Error("That proof domain is not on the allowed list.");
  }
}

export async function submitRecordAction(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/submit-record");
  }

  const parsed = recordSubmissionSchema.safeParse({
    playerUsername: formData.get("playerUsername"),
    mapId: formData.get("mapId"),
    gameType: formData.get("gameType"),
    percent: formData.get("percent"),
    isCompletion: getBooleanValue(formData, "isCompletion"),
    proofUrl: formData.get("proofUrl"),
    rawFootageUrl: formData.get("rawFootageUrl"),
    notes: formData.get("notes"),
    platform: formData.get("platform"),
    teammates: formData.get("teammates"),
    compliance: getBooleanValue(formData, "compliance"),
  });

  if (!parsed.success) {
    redirect(
      `/submit-record?status=error&message=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid submission.",
      )}`,
    );
  }

  try {
    assertAllowedProofDomain(parsed.data.proofUrl);
    if (parsed.data.rawFootageUrl) {
      assertAllowedProofDomain(parsed.data.rawFootageUrl);
    }
  } catch (error) {
    redirect(
      `/submit-record?status=error&message=${encodeURIComponent(
        error instanceof Error ? error.message : "Proof URL rejected.",
      )}`,
    );
  }

  if (!useDatabase) {
    redirect("/submit-record?status=demo&message=Submission+saved+in+demo+mode.");
  }

  const map = await prisma.map.findUnique({
    where: { id: parsed.data.mapId },
    include: { acceptedRecords: true },
  });

  if (!map) {
    redirect("/submit-record?status=error&message=Selected+map+was+not+found.");
  }

  if (
    !parsed.data.isCompletion &&
    parsed.data.percent < Math.max(1, map.minimumRecordPercent)
  ) {
    redirect(
      `/submit-record?status=error&message=${encodeURIComponent(
        `This map requires at least ${map.minimumRecordPercent}% for partial records.`,
      )}`,
    );
  }

  const recentCount = await prisma.recordSubmission.count({
    where: {
      submittedById: session.user.id,
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 30),
      },
    },
  });

  if (recentCount >= 5) {
    redirect(
      "/submit-record?status=error&message=Rate+limit+reached.+Try+again+later.",
    );
  }

  const playerProfile =
    (await prisma.playerProfile.findUnique({
      where: { username: parsed.data.playerUsername },
    })) ??
    (await prisma.playerProfile.create({
      data: {
        slug: slugify(parsed.data.playerUsername),
        username: parsed.data.playerUsername,
      },
    }));

  const duplicateAcceptedRecord = await prisma.acceptedRecord.findFirst({
    where: {
      playerId: playerProfile.id,
      mapId: map.id,
    },
    orderBy: { createdAt: "desc" },
  });

  if (
    duplicateAcceptedRecord &&
    duplicateAcceptedRecord.percent >= parsed.data.percent &&
    duplicateAcceptedRecord.isCompletion >= parsed.data.isCompletion
  ) {
    redirect(
      "/submit-record?status=error&message=An+equal+or+better+accepted+record+already+exists.",
    );
  }

  await prisma.recordSubmission.create({
    data: {
      submittedById: session.user.id,
      playerId: playerProfile.id,
      mapId: map.id,
      percent: parsed.data.percent,
      isCompletion:
        parsed.data.isCompletion || Number(parsed.data.percent) === 100,
      proofUrl: parsed.data.proofUrl,
      rawFootageUrl: parsed.data.rawFootageUrl,
      notes: parsed.data.notes,
      platform: parsed.data.platform,
      teammatesText: parsed.data.teammates,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/records");
  redirect("/submit-record?status=success&message=Record+submitted+for+review.");
}

export async function submitMapAction(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/submit-map");
  }

  const parsed = mapSubmissionSchema.safeParse({
    name: formData.get("name"),
    gameType: formData.get("gameType"),
    creatorText: formData.get("creatorText"),
    robloxUrl: formData.get("robloxUrl"),
    showcaseUrl: formData.get("showcaseUrl"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    estimatedDifficulty: formData.get("estimatedDifficulty"),
    description: formData.get("description"),
    skillsetText: formData.get("skillsetText"),
    isTeamMap: getBooleanValue(formData, "isTeamMap"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    redirect(
      `/submit-map?status=error&message=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Invalid submission.",
      )}`,
    );
  }

  if (!useDatabase) {
    redirect("/submit-map?status=demo&message=Map+submission+saved+in+demo+mode.");
  }

  const recentCount = await prisma.mapSubmission.count({
    where: {
      submittedById: session.user.id,
      createdAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
    },
  });

  if (recentCount >= 4) {
    redirect(
      "/submit-map?status=error&message=Rate+limit+reached.+Try+again+later.",
    );
  }

  await prisma.mapSubmission.create({
    data: {
      submittedById: session.user.id,
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      gameType: parsed.data.gameType,
      creatorText: parsed.data.creatorText,
      robloxUrl: parsed.data.robloxUrl,
      showcaseUrl: parsed.data.showcaseUrl,
      thumbnailUrl: parsed.data.thumbnailUrl,
      estimatedDifficulty: parsed.data.estimatedDifficulty,
      description: parsed.data.description,
      skillsetText: parsed.data.skillsetText,
      isTeamMap: parsed.data.isTeamMap,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/maps");
  redirect("/submit-map?status=success&message=Map+submitted+for+consideration.");
}

export async function reviewRecordSubmissionAction(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login?callbackUrl=/admin/records");
  }

  if (!useDatabase) {
    redirect("/admin/records?message=Database+mode+required+for+moderation.");
  }

  const submissionId = String(formData.get("submissionId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const moderatorMessage = String(formData.get("moderatorMessage") ?? "").trim();

  const submission = await prisma.recordSubmission.findUnique({
    where: { id: submissionId },
    include: {
      player: true,
      map: true,
    },
  });

  if (!submission || !submission.player) {
    redirect("/admin/records?message=Submission+not+found.");
  }

  const playerName = submission.player.username;
  const mapName = submission.map.name;

  if (decision === "ACCEPT") {
    const pointsAwarded = computeRecordPoints({
      difficultyScore: submission.map.difficultyScore,
      placement: submission.map.placement ?? 30,
      isCompletion: submission.isCompletion,
      percent: submission.percent,
      isTeamMap: submission.map.isTeamMap,
    });

    await prisma.$transaction(async (tx) => {
      const acceptedRecord = await tx.acceptedRecord.create({
        data: {
          submissionId: submission.id,
          playerId: submission.playerId!,
          mapId: submission.mapId,
          percent: submission.percent,
          isCompletion: submission.isCompletion,
          proofUrl: submission.proofUrl,
          rawFootageUrl: submission.rawFootageUrl,
          placementAtTimeOfAcceptance: submission.map.placement ?? 0,
          pointsAwarded,
          teammates: {
            create: parseCsv(submission.teammatesText).map((name, index) => ({
              displayName: name,
              sortOrder: index,
            })),
          },
        },
      });

      const records = await tx.acceptedRecord.findMany({
        where: { playerId: submission.playerId! },
        include: { map: true },
      });

      const totalPoints = records.reduce((sum, record) => sum + record.pointsAwarded, 0);
      const hardestRecord = [...records].sort(
        (left, right) => (left.map.placement ?? 999) - (right.map.placement ?? 999),
      )[0];

      await tx.playerProfile.update({
        where: { id: submission.playerId! },
        data: {
          totalPoints,
          hardestMapId: hardestRecord?.mapId,
        },
      });

      await tx.recordSubmission.update({
        where: { id: submission.id },
        data: {
          status: "ACCEPTED",
          moderatorMessage,
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "record.accepted",
          entityType: "RecordSubmission",
          entityId: submission.id,
          summary: `Accepted ${playerName}'s ${mapName} submission.`,
          metadata: { acceptedRecordId: acceptedRecord.id },
        },
      });
    });
  } else {
    await prisma.$transaction([
      prisma.recordSubmission.update({
        where: { id: submission.id },
        data: {
          status: "REJECTED",
          moderatorMessage,
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "record.rejected",
          entityType: "RecordSubmission",
          entityId: submission.id,
          summary: `Rejected ${playerName}'s ${mapName} submission.`,
        },
      }),
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/records");
  redirect("/admin/records?message=Submission+updated.");
}

export async function reviewMapSubmissionAction(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user || !["MODERATOR", "ADMIN"].includes(session.user.role)) {
    redirect("/login?callbackUrl=/admin/maps");
  }

  if (!useDatabase) {
    redirect("/admin/maps?message=Database+mode+required+for+moderation.");
  }

  const submissionId = String(formData.get("submissionId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const moderatorMessage = String(formData.get("moderatorMessage") ?? "").trim();

  const submission = await prisma.mapSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    redirect("/admin/maps?message=Submission+not+found.");
  }

  if (decision === "ACCEPT") {
    await prisma.$transaction(async (tx) => {
      await tx.mapSubmission.update({
        where: { id: submission.id },
        data: {
          status: "ACCEPTED",
          moderatorMessage,
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      });

      await tx.map.upsert({
        where: { slug: submission.slug ?? slugify(submission.name) },
        update: {
          description: submission.description,
          shortDescription: submission.description.slice(0, 110),
          thumbnailUrl: submission.thumbnailUrl,
          showcaseUrl: submission.showcaseUrl,
          robloxUrl: submission.robloxUrl,
          verifierStatus: "Pending Verification",
          isTeamMap: submission.isTeamMap,
          difficultyScore: submission.estimatedDifficulty ?? 60,
          status: "PENDING",
          recordRequirementText:
            "Raw footage preferred while the map is under initial review.",
          minimumRecordPercent: submission.isTeamMap ? 55 : 60,
          creators: {
            deleteMany: {},
            create: parseCsv(submission.creatorText).map((creator, index) => ({
              name: creator,
              sortOrder: index,
            })),
          },
        },
        create: {
          slug: submission.slug ?? slugify(submission.name),
          name: submission.name,
          gameType: submission.gameType,
          description: submission.description,
          shortDescription: submission.description.slice(0, 110),
          thumbnailUrl: submission.thumbnailUrl,
          bannerUrl: submission.thumbnailUrl,
          showcaseUrl: submission.showcaseUrl,
          robloxUrl: submission.robloxUrl,
          verifierStatus: "Pending Verification",
          isTeamMap: submission.isTeamMap,
          difficultyScore: submission.estimatedDifficulty ?? 60,
          status: "PENDING",
          recordRequirementText:
            "Raw footage preferred while the map is under initial review.",
          minimumRecordPercent: submission.isTeamMap ? 55 : 60,
          creators: {
            create: parseCsv(submission.creatorText).map((creator, index) => ({
              name: creator,
              sortOrder: index,
            })),
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "map.accepted",
          entityType: "MapSubmission",
          entityId: submission.id,
          summary: `Accepted ${submission.name} for list review.`,
        },
      });
    });
  } else {
    await prisma.$transaction([
      prisma.mapSubmission.update({
        where: { id: submission.id },
        data: {
          status: "REJECTED",
          moderatorMessage,
          reviewedById: session.user.id,
          reviewedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "map.rejected",
          entityType: "MapSubmission",
          entityId: submission.id,
          summary: `Rejected ${submission.name}.`,
        },
      }),
    ]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/maps");
  redirect("/admin/maps?message=Submission+updated.");
}
