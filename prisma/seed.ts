import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

function getSeedCredential(key: string, fallback: string) {
  return process.env[key]?.trim() || fallback;
}

async function main() {
  const adminEmail = getSeedCredential("SEED_ADMIN_EMAIL", "admin@fhml.local");
  const moderatorEmail = getSeedCredential(
    "SEED_MODERATOR_EMAIL",
    "moderator@fhml.local",
  );
  const adminPassword = getSeedCredential(
    "SEED_ADMIN_PASSWORD",
    "demo-pass-123",
  );
  const moderatorPassword = getSeedCredential(
    "SEED_MODERATOR_PASSWORD",
    "demo-pass-123",
  );

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
  await prisma.moderatorNote.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.playerProfile.deleteMany();
  await prisma.map.deleteMany();
  await prisma.user.deleteMany();

  const [adminHash, moderatorHash] = await Promise.all([
    bcrypt.hash(adminPassword, 10),
    bcrypt.hash(moderatorPassword, 10),
  ]);

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Primary Administrator",
      hashedPassword: adminHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: moderatorEmail,
      name: "Primary Moderator",
      hashedPassword: moderatorHash,
      role: Role.MODERATOR,
    },
  });

  await prisma.announcement.create({
    data: {
      slug: "launch-empty-roster",
      title: "Launch state",
      body: "The list starts empty by design. Staff can add the first maps from the admin panel once production is live.",
      severity: "INFO",
      isPinned: true,
    },
  });
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
