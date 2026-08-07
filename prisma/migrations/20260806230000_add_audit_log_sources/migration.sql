ALTER TABLE "AuditLog"
ADD COLUMN "clientId" TEXT,
ADD COLUMN "sourceType" TEXT,
ADD COLUMN "sourceId" TEXT;

CREATE INDEX "AuditLog_tenantId_clientId_createdAt_idx"
ON "AuditLog"("tenantId", "clientId", "createdAt");

CREATE UNIQUE INDEX "AuditLog_sourceType_sourceId_key"
ON "AuditLog"("sourceType", "sourceId");
