CREATE SCHEMA IF NOT EXISTS "notification";

CREATE TABLE "notification"."Notification" (
    "id" TEXT NOT NULL,
    "recipientUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ANNOUNCEMENT',
    "sourceId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_recipientUserId_createdAt_idx"
  ON "notification"."Notification"("recipientUserId", "createdAt");
CREATE INDEX "Notification_recipientUserId_readAt_idx"
  ON "notification"."Notification"("recipientUserId", "readAt");
